"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import { marketPage } from "@/lib/content";

/**
 * EarthGlobe — one continuous, real-time WebGL globe (Three.js).
 *
 * - Countries come from Natural Earth 1:50m GeoJSON (world-atlas, served from
 *   /data/countries-50m.json). Fills are painted from the polygons into an
 *   equirectangular canvas texture; national borders and coastlines are real
 *   vector line geometry laid on the sphere.
 * - Texas Chicken markets are orange, every other country is charcoal.
 * - Region focus slerps the globe's quaternion to the target orientation
 *   (shortest path, eased); dragging interrupts it at any moment.
 * - Drag / touch to spin freely (with inertia), click a country to select it.
 */

/** ISO 3166-1 numeric ids (world-atlas feature ids) of our markets → market code in marketPage.markets. */
const MARKET_CODES: Record<string, string> = {
  "818": "eg", "504": "ma", "682": "sa", "784": "ae", "634": "qa", "048": "bh", "512": "om", "368": "iq",
  "458": "my", "702": "sg", "360": "id", "704": "vn", "116": "kh", "418": "la", "554": "nz",
  "276": "de", "268": "ge", "031": "az",
  "840": "us", "124": "ca", "484": "mx", "340": "hn", "388": "jm", "630": "pr", "850": "vi",
  "659": "kn", "662": "lc", "780": "tt", "328": "gy",
};
/** feature id → that market's own website */
const MARKET_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(MARKET_CODES)
    .map(([id, code]) => [id, marketPage.markets.find((m) => m.code === code)?.url ?? ""])
    .filter(([, url]) => url)
);

const OCEAN = "#ececee";
const LAND = "#3b3a3c";
const MARKET = "#f39a2c";
const MARKET_SELECTED = "#ffb43f";
const BORDER = 0x1c1a19;
/** Idle spin speed (rad/ms) and how long the globe waits before resuming it. */
const SPIN = 0.00007;
const RESUME_MS = 2500;

const D2R = Math.PI / 180;
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);

/** Point on the unit sphere matching THREE.SphereGeometry's equirectangular UVs. */
function toVec(lon: number, lat: number, r = 1) {
  const cl = Math.cos(lat * D2R);
  return new THREE.Vector3(r * cl * Math.cos(lon * D2R), r * Math.sin(lat * D2R), -r * cl * Math.sin(lon * D2R));
}

/** Orientation that puts (lat, lon) in the centre of the view, north up. */
function orientation(lat: number, lon: number) {
  const qy = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, -Math.PI / 2 - lon * D2R);
  const qx = new THREE.Quaternion().setFromAxisAngle(AXIS_X, lat * D2R);
  return qx.multiply(qy);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Country = { id: string; name: string; market: boolean; url?: string; path: Path2D };

/** Path in "degree space" (x = lon + 180, y = 90 - lat); antimeridian-safe. */
function ringsToPath(polys: number[][][][]) {
  const p = new Path2D();
  for (const poly of polys) {
    for (const ring of poly) {
      // unwrap longitudes so a ring never jumps 360°
      const pts: [number, number][] = [];
      let prev = ring[0][0];
      let shift = 0;
      for (const [lon, lat] of ring) {
        const d = lon - prev;
        if (d > 180) shift -= 360;
        else if (d < -180) shift += 360;
        prev = lon;
        pts.push([lon + shift, lat]);
      }
      let min = Infinity;
      let max = -Infinity;
      for (const [x] of pts) {
        if (x < min) min = x;
        if (x > max) max = x;
      }
      // a ring that circles a pole (Antarctica) is drawn as-is
      const src: [number, number][] = max - min > 350 ? (ring as [number, number][]) : pts;
      const offsets = max - min > 350 ? [0] : [0, ...(min < -180 ? [360] : []), ...(max > 180 ? [-360] : [])];
      for (const off of offsets) {
        src.forEach(([lon, lat], i) => {
          const x = lon + 180 + off;
          const y = 90 - lat;
          if (i === 0) p.moveTo(x, y);
          else p.lineTo(x, y);
        });
        p.closePath();
      }
    }
  }
  return p;
}

export type GlobeFocus = { lat: number; lon: number; n: number };

export default function EarthGlobe({
  focus,
  onAutoplay,
  initial = { lat: 22, lon: 20 },
  className = "",
}: {
  focus?: GlobeFocus | null;
  /** Called when the idle spin starts again (e.g. to clear the active region). */
  onAutoplay?: () => void;
  initial?: { lat: number; lon: number };
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ focus: (lat: number, lon: number) => void } | null>(null);
  const onAutoplayRef = useRef(onAutoplay);
  onAutoplayRef.current = onAutoplay;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const labelRef = useRef<HTMLDivElement>(null);
  const overLabelRef = useRef(false); // pointer on the popup counts as hovering the globe
  const [label, setLabel] = useState<{ name: string; market: boolean; url?: string } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let disposed = false;
    let cleanup = () => {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      let topo: any;
      try {
        topo = await fetch("/data/countries-50m.json").then((r) => r.json());
      } catch {
        if (!disposed) setStatus("error");
        return;
      }
      if (disposed) return;

      /* ---------------------------------------------------------- renderer */
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setStatus("error");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y;cursor:grab;";
      wrap.prepend(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 4.1);

      // soft studio light: bright, even fill with a gentle key from top-left
      scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcac5, 2.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(-2, 2, 5);
      scene.add(key);

      /* --------------------------------------------------------- countries */
      const feats = (feature(topo, topo.objects.countries) as any).features as any[];
      const countries: Country[] = feats.map((f) => {
        const g = f.geometry;
        const polys = g ? (g.type === "Polygon" ? [g.coordinates] : g.coordinates) : [];
        const id = String(f.id ?? "");
        const url = MARKET_URLS[id];
        return { id, name: f.properties?.name ?? "", market: !!url, url, path: ringsToPath(polys) };
      });
      const allLand = new Path2D();
      countries.forEach((c) => allLand.addPath(c.path));

      /* colour texture */
      const maxTex = renderer.capabilities.maxTextureSize;
      const W = Math.min(wrap.clientWidth < 520 ? 2048 : 4096, maxTex);
      const H = W / 2;
      const colorCanvas = document.createElement("canvas");
      colorCanvas.width = W;
      colorCanvas.height = H;
      const cctx = colorCanvas.getContext("2d")!;
      const texture = new THREE.CanvasTexture(colorCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      // base map painted once; selecting a country only redraws that country on top
      const base = document.createElement("canvas");
      base.width = W;
      base.height = H;
      const bctx = base.getContext("2d")!;
      bctx.fillStyle = OCEAN;
      bctx.fillRect(0, 0, W, H);
      bctx.setTransform(W / 360, 0, 0, H / 180, 0, 0);
      // soft drop shadow under the land gives the "raised paper" depth
      bctx.save();
      bctx.shadowColor = "rgba(25,22,20,0.32)";
      bctx.shadowBlur = W / 900;
      bctx.shadowOffsetY = W / 1800;
      bctx.fillStyle = LAND;
      bctx.fill(allLand, "evenodd");
      bctx.restore();
      countries.forEach((c) => {
        bctx.fillStyle = c.market ? MARKET : LAND;
        bctx.fill(c.path, "evenodd");
      });

      // selected country turns orange (a brighter orange if it's already a market)
      const paint = (sel: number) => {
        cctx.setTransform(1, 0, 0, 1, 0, 0);
        cctx.drawImage(base, 0, 0);
        if (sel >= 0) {
          cctx.setTransform(W / 360, 0, 0, H / 180, 0, 0);
          cctx.fillStyle = countries[sel].market ? MARKET_SELECTED : MARKET;
          cctx.fill(countries[sel].path, "evenodd");
        }
        texture.needsUpdate = true;
      };
      paint(-1);

      /* id map for picking (country index encoded in R/G) */
      const IW = 2048;
      const IH = 1024;
      const idCanvas = document.createElement("canvas");
      idCanvas.width = IW;
      idCanvas.height = IH;
      const ictx = idCanvas.getContext("2d", { willReadFrequently: true })!;
      ictx.setTransform(IW / 360, 0, 0, IH / 180, 0, 0);
      countries.forEach((c, i) => {
        const n = i + 1;
        ictx.fillStyle = `rgb(${n & 255},${n >> 8},0)`;
        ictx.fill(c.path, "evenodd");
      });
      const idData = ictx.getImageData(0, 0, IW, IH).data;
      const pick = (u: number, v: number) => {
        const x = Math.min(IW - 1, Math.max(0, Math.floor(u * IW)));
        const y = Math.min(IH - 1, Math.max(0, Math.floor((1 - v) * IH)));
        const o = (y * IW + x) * 4;
        if (idData[o + 3] < 250 || idData[o + 2] !== 0) return -1;
        const idx = idData[o] + idData[o + 1] * 256 - 1;
        return idx >= 0 && idx < countries.length ? idx : -1;
      };

      /* -------------------------------------------------------------- globe */
      const globe = new THREE.Group();
      scene.add(globe);
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 128, 96),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.88, metalness: 0 })
      );
      globe.add(sphere);

      // vector borders + coastlines (shared arcs drawn once)
      const borders = mesh(topo, topo.objects.countries) as any;
      const pos: number[] = [];
      const R = 1.0012;
      for (const line of borders.coordinates as number[][][]) {
        for (let i = 1; i < line.length; i++) {
          const [lon0, lat0] = line[i - 1];
          const [lon1, lat1] = line[i];
          if (Math.abs(lon1 - lon0) > 180) continue; // antimeridian seam
          const a = toVec(lon0, lat0, R);
          const b = toVec(lon1, lat1, R);
          const steps = Math.max(1, Math.ceil(a.angleTo(b) / (1.5 * D2R)));
          let p0 = a;
          for (let s = 1; s <= steps; s++) {
            const p1 = s === steps ? b : a.clone().lerp(b, s / steps).setLength(R);
            pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
            p0 = p1;
          }
        }
      }
      const borderGeo = new THREE.BufferGeometry();
      borderGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const borderMat = new THREE.LineBasicMaterial({ color: BORDER, transparent: true, opacity: 0.6 });
      globe.add(new THREE.LineSegments(borderGeo, borderMat));

      /* ------------------------------------------------------------- motion */
      globe.quaternion.copy(orientation(initial.lat, initial.lon));

      // idle spin: turns the planet on its own axis, eased in and out
      let spinV = 0;
      let hovering = false;
      let idleSince = -Infinity; // spin resumes RESUME_MS after this

      let tween: { from: THREE.Quaternion; to: THREE.Quaternion; t0: number; dur: number } | null = null;
      const vel = { x: 0, y: 0 };
      const focusTo = (lat: number, lon: number) => {
        vel.x = vel.y = 0;
        spinV = 0;
        const to = orientation(lat, lon);
        const angle = globe.quaternion.angleTo(to);
        tween = {
          from: globe.quaternion.clone(),
          to,
          t0: performance.now(),
          dur: reduce ? 250 : Math.min(2200, 900 + angle * 520),
        };
      };
      apiRef.current = { focus: focusTo };

      /* drag / touch / click */
      let dragging = false;
      let moved = 0;
      let last = { x: 0, y: 0, t: 0 };
      const qTmp = new THREE.Quaternion();
      const rotateBy = (dx: number, dy: number) => {
        globe.quaternion.premultiply(qTmp.setFromAxisAngle(AXIS_Y, dx));
        globe.quaternion.premultiply(qTmp.setFromAxisAngle(AXIS_X, dy));
      };
      const radPerPx = () => Math.PI / Math.max(320, wrap.clientWidth);

      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      // only markets (orange) are interactive; other countries behave like ocean
      const hitAt = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const h = ray.intersectObject(sphere, false)[0];
        const idx = h && h.uv ? pick(h.uv.x, h.uv.y) : -1;
        return { idx: idx >= 0 && countries[idx].market ? idx : -1, point: h?.point };
      };

      // click a country to select it: it's highlighted and its name popup sits on
      // it, turning with the globe. Markets get a "Visit market" link in the popup.
      let selected = -1;
      const selLocal = new THREE.Vector3();
      const select = (idx: number, point?: THREE.Vector3) => {
        selected = idx;
        paint(idx);
        if (idx >= 0 && point) {
          selLocal.copy(globe.worldToLocal(point.clone()));
          const c = countries[idx];
          setLabel({ name: c.name, market: c.market, url: c.url });
        } else setLabel(null);
      };

      const onEnter = () => {
        hovering = true;
      };
      const onLeave = () => {
        hovering = false;
        idleSince = performance.now();
      };
      const onDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        dragging = true;
        moved = 0;
        tween = null; // drag interrupts any focus animation
        spinV = 0;
        vel.x = vel.y = 0;
        last = { x: e.clientX, y: e.clientY, t: performance.now() };
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
      };
      // hovering a country opens its popup straight away; passing over ocean keeps
      // the current popup open so its link stays reachable.
      const onMove = (e: PointerEvent) => {
        if (!dragging) {
          const { idx, point } = hitAt(e);
          canvas.style.cursor = idx >= 0 ? "pointer" : "grab";
          if (idx >= 0 && idx !== selected && point && e.pointerType === "mouse") select(idx, point);
          return;
        }
        const now = performance.now();
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        const k = radPerPx();
        rotateBy(dx * k, dy * k);
        const dt = Math.max(1, now - last.t);
        vel.x = ((dx * k) / dt) * 16;
        vel.y = ((dy * k) / dt) * 16;
        last = { x: e.clientX, y: e.clientY, t: now };
      };
      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        idleSince = performance.now();
        canvas.style.cursor = "grab";
        if (idleSince - last.t > 80) vel.x = vel.y = 0;
        if (moved < 6) {
          vel.x = vel.y = 0;
          const { idx, point } = hitAt(e);
          // with a mouse the popup already opened on hover, so a click keeps it;
          // on touch, tapping the same country again closes it
          const toggleOff = idx === selected && e.pointerType !== "mouse";
          select(toggleOff ? -1 : idx, point);
        }
      };
      canvas.addEventListener("pointerenter", onEnter);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      /* size */
      const resize = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      /* loop — only while on screen */
      let visible = true;
      const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "100px" });
      io.observe(wrap);

      let raf = 0;
      let wasSpinning = false;
      const world = new THREE.Vector3();
      let prevT = performance.now();
      const tick = (t: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(64, t - prevT);
        prevT = t;
        if (!visible) return;

        const coasting = Math.abs(vel.x) > 1e-5 || Math.abs(vel.y) > 1e-5;
        if (tween) {
          const k = Math.min(1, (t - tween.t0) / tween.dur);
          globe.quaternion.slerpQuaternions(tween.from, tween.to, easeInOut(k));
          // hold the chosen region a little longer before spinning again
          if (k >= 1) {
            tween = null;
            idleSince = t + 3000;
          }
        } else if (!dragging && coasting) {
          rotateBy(vel.x * (dt / 16), vel.y * (dt / 16));
          const decay = Math.pow(0.93, dt / 16);
          vel.x *= decay;
          vel.y *= decay;
        }

        // autoplay whenever the globe isn't hovered, dragged or turning to a region
        const wantSpin =
          !reduce && !tween && !dragging && !coasting && !hovering && !overLabelRef.current && t - idleSince > RESUME_MS;
        if (wantSpin && !wasSpinning) onAutoplayRef.current?.();
        wasSpinning = wantSpin;
        spinV += ((wantSpin ? SPIN : 0) - spinV) * Math.min(1, dt / 700);
        if (spinV > 1e-7) globe.quaternion.multiply(qTmp.setFromAxisAngle(AXIS_Y, spinV * dt));

        // name popup follows the selected country, hides on the far side
        const el = labelRef.current;
        if (el && selected >= 0) {
          world.copy(selLocal).applyQuaternion(globe.quaternion);
          const front = world.z > 0.15;
          world.project(camera);
          el.style.opacity = front ? "1" : "0";
          el.style.pointerEvents = front ? "auto" : "none";
          el.style.transform = `translate(${((world.x + 1) / 2) * wrap.clientWidth}px, ${((1 - world.y) / 2) * wrap.clientHeight}px) translate(-50%, calc(-100% - 12px))`;
        }

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);
      setStatus("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        canvas.removeEventListener("pointerenter", onEnter);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
        texture.dispose();
        borderGeo.dispose();
        borderMat.dispose();
        renderer.dispose();
        canvas.remove();
        apiRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // region menu → rotate the same globe
  useEffect(() => {
    if (focus && apiRef.current) apiRef.current.focus(focus.lat, focus.lon);
  }, [focus]);

  return (
    <div ref={wrapRef} className={`select-none ${className || "relative"}`}>
      {status !== "ready" && (
        <div className="absolute inset-[4%] grid place-items-center rounded-full bg-[#ececee] shadow-[inset_-30px_-40px_80px_rgba(45,41,38,0.18)]">
          {status === "error" && <span className="px-8 text-center text-sm text-third/60">The interactive globe needs WebGL.</span>}
        </div>
      )}
      {/* country name popup */}
      <div
        ref={labelRef}
        aria-live="polite"
        onPointerEnter={() => (overLabelRef.current = true)}
        onPointerLeave={() => (overLabelRef.current = false)}
        className={`absolute left-0 top-0 z-10 whitespace-nowrap rounded-xl px-3.5 py-2 shadow-soft3 transition-opacity duration-200 ${
          label ? "" : "invisible"
        } ${label?.market ? "bg-primary text-white" : "bg-third text-white"}`}
      >
        {label && (
          <>
            <span className="display block text-lg leading-none">{label.name}</span>
            {label.market && label.url && (
              <a
                href={label.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-caps text-secondary underline-offset-4 hover:underline"
              >
                Visit market <span aria-hidden>↗</span>
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
