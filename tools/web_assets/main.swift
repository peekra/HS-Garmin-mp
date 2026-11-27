// web_assets - watch images of the demo shop (demo/assets/img).
//
// Build:  swiftc -O tools/web_assets/*.swift -o /tmp/web_assets
// Run:    /tmp/web_assets            (paths are taken from this file's location)
// Inputs: ../Weinachten_GasDefizit/design/promo_captures/{locked,gym}.png  simulator captures (932 px, circle cut out)
// Output: demo/assets/img/watch_hero.png, watch_free.png, watch_unlocked.png
//         Round outdoor watch with a black band that fades out, transparent background, no text,
//         so the images work on the light and on the dark page.
// WatchDraw.swift is a copy of ../design/drafts/store_tools/lib/WatchDraw.swift (the case of the store icons of
// the other CodeBear watch faces). The shop is its own repository, so it keeps its own copy.

import CoreGraphics
import Foundation

let toolDir = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
let root = toolDir.deletingLastPathComponent().deletingLastPathComponent()
let capDir = root.deletingLastPathComponent().appendingPathComponent("Weinachten_GasDefizit/design/promo_captures")
let outDir = root.appendingPathComponent("demo/assets/img")

// One watch per image. R = display radius in output pixels, band = how far the band reaches (display radii).
func watchImage(_ name: String, capture: String, r R: Double, band: Double, ss: Double = 3) {
    let w = (2 * 1.5 * R).rounded(), h = (2 * band * R).rounded()
    let ctx = makeContext(Int(w * ss), Int(h * ss))
    ctx.scaleBy(x: ss, y: ss)
    ctx.interpolationQuality = .high
    let center = CGPoint(x: w / 2, y: h / 2)
    let painter = WatchPainter(ctx, center: center, radius: R, style: .dlc)

    // soft shadow under the case, so the watch also stands out on the light page
    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -R * 0.05), blur: R * 0.22, color: col(0x000000, 0.45))
    ctx.addPath(painter.casePath()); ctx.setFillColor(col(0x272625)); ctx.fillPath()
    ctx.restoreGState()

    let face = FaceImage.load(capDir.appendingPathComponent("\(capture).png").path)
    guard face != nil else { fatalError("cannot read \(capture).png in \(capDir.path)") }
    painter.drawWatch(face: face, bandLength: band, bandFade: true, glass: 0.05)

    // keep the alpha channel: downsample into a transparent context
    let big = ctx.makeImage()!
    let out = makeContext(Int(w), Int(h))
    out.interpolationQuality = .high
    out.draw(big, in: CGRect(x: 0, y: 0, width: w, height: h))
    try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
    let path = outDir.appendingPathComponent(name).path
    writePNG(out.makeImage()!, path)
    print("demo/assets/img/\(name): \(Int(w))x\(Int(h))")
}

watchImage("watch_hero.png", capture: "locked", r: 300, band: 1.95)
watchImage("watch_free.png", capture: "locked", r: 190, band: 1.75)
watchImage("watch_unlocked.png", capture: "gym", r: 190, band: 1.75)
