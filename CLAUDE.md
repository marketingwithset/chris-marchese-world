# CLAUDE.md — Project Intelligence Rules

## Prompt Clarity Protocol

Before executing any complex task (architecture changes, performance work, multi-file refactors, new features, debugging ambiguous issues), check whether the prompt includes sufficient context across these six dimensions:

1. **Role** — What expertise should you bring to this task?
2. **Task** — What specifically needs to happen?
3. **Context** — What's the current state, stack, constraints, and known info?
4. **Reasoning** — Why this approach? What's the strategic intent?
5. **Stop Conditions** — How do we know when the task is truly done?
6. **Output Format** — How should the deliverable be structured?

### When a prompt is missing critical sections:

- Do NOT guess or fill in assumptions silently.
- Ask 1-3 focused clarifying questions to fill the gaps BEFORE writing any code.
- Frame questions as quick-answer options, not open-ended essays. Example:

> Before I start, a few quick ones:
> - Are we targeting 60fps on mid-range devices or just desktop? (Context)
> - Should I refactor in place or build a parallel version? (Task scope)
> - Want the output as a PR-ready commit or a scoped plan first? (Output)

### When you CAN skip this:

- Single-file edits, typo fixes, small CSS changes, quick terminal commands
- Any prompt where the task, scope, and expected output are already obvious
- Follow-up prompts in an active thread where context is already established

### Always:

- Prioritize working code over explanations
- If a task has multiple valid approaches, present 2-3 options with tradeoffs BEFORE building
- Flag risks or breaking changes before implementing them
- When debugging: diagnose first, fix second — never shotgun random changes
- Commit messages should be clear and reference what was fixed/added/changed

## Project Context

- This is an interactive 3D web environment built for a public-facing website
- Stack: Three.js / React Three Fiber (browser-based, client-side rendering)
- Performance and load time are critical — visitors on real devices, not dev machines
- Target: 60fps on mid-range hardware, initial load under 3 seconds
- Builder preference: ship fast, iterate, stay in flow — don't over-engineer
- AI-native development workflow — Claude Code is the primary build tool
- No backend GPU servers — everything runs client-side in the browser
- Unreal Engine / Pixel Streaming is NOT the path — optimize within the web stack

## Three.js Performance Playbook

When diagnosing or optimizing 3D performance, work through these layers in order. Don't jump to architectural rewrites before exhausting the quick wins.

### Layer 1 — Measure First

- Use `stats.js` (FPS/MS/MB panel) or React Three Fiber's `<Stats />` to get baseline numbers
- Open Chrome DevTools → Performance tab → record a 5-second capture
- Check `renderer.info` for draw calls, triangles, geometries, and textures in scene
- Identify whether the bottleneck is CPU-bound (JS/logic) or GPU-bound (rendering)

### Layer 2 — Geometry & Draw Calls (biggest wins)

- **Instanced meshes**: If you have many copies of the same geometry (trees, particles, cubes), use `InstancedMesh` — one draw call instead of hundreds
- **Merge static geometry**: Use `BufferGeometryUtils.mergeGeometries()` for objects that never move independently
- **LOD (Level of Detail)**: Use `THREE.LOD` to swap in simpler models when objects are far from camera
- **Reduce polygon count**: Most web 3D should stay under 100K triangles total. Decimate models in Blender before importing
- **Draco compression**: Compress `.glTF` models with Draco — 80-90% file size reduction
- Target: under 50 draw calls for a smooth scene, under 200 for complex ones

### Layer 3 — Textures & Materials

- **Resize textures**: No texture should exceed 2048x2048 for web. Most can be 512x512 or 1024x1024
- **Use compressed formats**: KTX2/Basis Universal textures load faster and use less GPU memory
- **Share materials**: Reuse `MeshStandardMaterial` instances across objects instead of creating duplicates
- **Simplify materials**: Switch `MeshStandardMaterial` → `MeshBasicMaterial` or `MeshLambertMaterial` for objects that don't need realistic lighting
- **Texture atlases**: Combine multiple small textures into one atlas to reduce texture swaps

### Layer 4 — Lighting & Shadows

- **Limit real-time lights**: Every light adds a render pass. Max 2-3 dynamic lights for web
- **Bake lighting**: Pre-bake light maps in Blender and apply as textures — zero runtime cost
- **Shadow maps**: If using shadows, keep shadow map resolution low (512-1024). Limit shadow-casting lights to 1
- **Avoid `PointLight` shadows**: They render 6 shadow maps (one per cube face). Use `DirectionalLight` or `SpotLight` instead
- Consider disabling shadows entirely and faking them with blob shadows (textured planes under objects)

### Layer 5 — Rendering Pipeline

- **Pixel ratio**: Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — never render at 3x on Retina screens
- **Frustum culling**: Enabled by default in Three.js — make sure you haven't disabled it
- **Render on demand**: If the scene isn't constantly animating, use `invalidate()` in R3F instead of rendering every frame
- **Postprocessing**: Each pass (bloom, SSAO, DOF) adds a full-screen render. Use sparingly, combine passes where possible
- **Anti-aliasing**: Use FXAA (cheap) over MSAA (expensive) for post-process AA

### Layer 6 — Loading & Initial Performance

- **Lazy load models**: Don't load everything on page load. Use `Suspense` in R3F to stream assets
- **GLTF over FBX/OBJ**: glTF is the optimized web format. Always convert
- **Preload critical assets**: Use `useGLTF.preload()` for hero elements
- **Code split**: Dynamic `import()` for heavy 3D components so they don't block the main bundle
- **Progressive loading**: Show a lightweight version first, swap in high-quality assets after load

### Layer 7 — Advanced (only if Layers 1-6 aren't enough)

- **WebGPU renderer**: Three.js has experimental WebGPU support — significant performance gains for complex scenes. Worth testing if WebGL is maxed out
- **OffscreenCanvas**: Move rendering to a Web Worker to free up the main thread
- **Custom shaders**: Replace heavy materials with optimized GLSL shaders for specific visual effects
- **Object pooling**: For particles or spawning objects, reuse from a pool instead of creating/destroying

### Performance Red Flags to Watch For

- Draw calls over 200 → merge geometry or use instancing
- Triangle count over 500K → decimate models
- Textures over 4096px → resize immediately
- More than 3 real-time lights with shadows → bake or fake
- Frame time over 16ms → you're below 60fps, start profiling
- Memory climbing over time → you have a leak, check for undisposed geometries/materials
