// render_web_assets.swift - images of the demo shop website (demo/assets/img).
//
// Build:  swiftc -O tools/render_web_assets.swift -o /tmp/render_web_assets
// Run:    /tmp/render_web_assets        (paths are taken from this file's location)
// Inputs: ../Weinachten_GasDefizit/design/promo_captures/{locked,gym}.png  simulator captures (932 px, circle cut out)
// Output: demo/assets/img/watch_hero.png, watch_free.png, watch_unlocked.png
//         Watch case and band without any text, transparent background (the page draws its own sky).
// The watch drawing is copied from ../Weinachten_GasDefizit/design/tools/promo/make_promo.swift (drawWatch),
// which stays unchanged. Scenes, social image and favicon are copied with sips (see README.md).

import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let toolDir = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
let root = toolDir.deletingLastPathComponent()
let capDir = root.deletingLastPathComponent().appendingPathComponent("Weinachten_GasDefizit/design/promo_captures")
let outDir = root.appendingPathComponent("demo/assets/img")

let sRGB = CGColorSpace(name: CGColorSpace.sRGB)!
func col(_ hex: UInt32, _ a: Double = 1) -> CGColor {
    CGColor(colorSpace: sRGB, components: [Double((hex >> 16) & 255) / 255, Double((hex >> 8) & 255) / 255,
                                           Double(hex & 255) / 255, a])!
}
func grad(_ stops: [(Double, UInt32, Double)]) -> CGGradient {
    CGGradient(colorsSpace: sRGB, colors: stops.map { col($0.1, $0.2) } as CFArray, locations: stops.map { CGFloat($0.0) })!
}
let red: UInt32 = 0xD8262E

func loadImage(_ url: URL) -> CGImage {
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        fatalError("cannot read \(url.path)")
    }
    return img
}
func cap(_ name: String) -> CGImage { loadImage(capDir.appendingPathComponent("\(name).png")) }

// Transparent canvas, supersampled; layout top-down, drawing y-up.
final class Canvas {
    let W: Double, H: Double, ss: Double
    let ctx: CGContext
    init(_ w: Double, _ h: Double, ss: Double = 2) {
        W = w; H = h; self.ss = ss
        ctx = CGContext(data: nil, width: Int(w * ss), height: Int(h * ss), bitsPerComponent: 8, bytesPerRow: 0, space: sRGB,
                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
        ctx.scaleBy(x: ss, y: ss)
        ctx.interpolationQuality = .high
    }
    func Y(_ top: Double) -> Double { H - top }

    func save(_ name: String) {
        let big = ctx.makeImage()!
        let w = Int(W), h = Int(H)
        let c = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: sRGB,
                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
        c.interpolationQuality = .high
        c.draw(big, in: CGRect(x: 0, y: 0, width: w, height: h))
        let url = outDir.appendingPathComponent(name)
        try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
        let d = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
        CGImageDestinationAddImage(d, c.makeImage()!, nil)
        guard CGImageDestinationFinalize(d) else { fatalError("write \(url.path)") }
        let kb = ((try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int) ?? 0) / 1024
        print("demo/assets/img/\(name): \(w)x\(h), \(kb) KB")
    }
}

// MARK: - Watch (copy of make_promo.swift drawWatch: round outdoor watch, dark steel case, red band)

enum WG {   // geometry in display radii
    static let caseR = 1.30, bezelIn = 1.16, lensIn = 1.0
    static let bandHalf = 0.62, lugTop = 1.42
}

func drawWatch(_ cv: Canvas, face: CGImage?, cx: Double, cyTop: Double, r R: Double, band: Double = 2.6) {
    let ctx = cv.ctx
    let C = CGPoint(x: cx, y: cv.Y(cyTop))
    func P(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: C.x + x * R, y: C.y + y * R) }
    func circle(_ r: Double) -> CGPath { CGPath(ellipseIn: CGRect(x: C.x - r * R, y: C.y - r * R, width: 2 * r * R, height: 2 * r * R), transform: nil) }
    func linear(_ path: CGPath, _ g: CGGradient, _ a: CGPoint, _ b: CGPoint) {
        ctx.saveGState(); ctx.addPath(path); ctx.clip()
        ctx.drawLinearGradient(g, start: a, end: b, options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
        ctx.restoreGState()
    }

    ctx.saveGState()
    ctx.setShadow(offset: CGSize(width: 0, height: -R * 0.06), blur: R * 0.30, color: col(0x000000, 0.55))

    ctx.beginTransparencyLayer(auxiliaryInfo: nil)
    for dir in [1.0, -1.0] {
        let p = CGMutablePath()
        p.addRoundedRect(in: CGRect(x: C.x - WG.bandHalf * R, y: dir > 0 ? C.y : C.y - band * R,
                                    width: 2 * WG.bandHalf * R, height: band * R), cornerWidth: R * 0.12, cornerHeight: R * 0.12)
        ctx.saveGState(); ctx.addPath(p); ctx.clip()
        ctx.drawLinearGradient(grad([(0, 0x5E1418, 1), (0.25, 0x9C2027, 1), (0.5, 0xB3262E, 1), (0.75, 0x9C2027, 1), (1, 0x5E1418, 1)]),
                               start: P(-WG.bandHalf, 0), end: P(WG.bandHalf, 0), options: [])
        ctx.setStrokeColor(col(0x000000, 0.22)); ctx.setLineWidth(R * 0.035)
        var k = 1.75
        while k < band {
            ctx.move(to: P(-WG.bandHalf * 0.55, dir * k)); ctx.addLine(to: P(WG.bandHalf * 0.55, dir * k)); k += 0.32
        }
        ctx.strokePath()
        ctx.setBlendMode(.destinationOut)
        let endY = dir * band, fadeY = dir * (band - 0.9)
        ctx.drawLinearGradient(grad([(0, 0x000000, 0), (1, 0x000000, 1)]), start: P(0, fadeY), end: P(0, endY),
                               options: [.drawsAfterEndLocation])
        ctx.restoreGState()
    }
    ctx.endTransparencyLayer()
    let lugs = CGMutablePath()
    for sx in [-1.0, 1.0] { for sy in [-1.0, 1.0] {
        let x0 = sx > 0 ? 0.40 : -0.86, y0 = sy > 0 ? 0.80 : -WG.lugTop
        lugs.addRoundedRect(in: CGRect(x: C.x + x0 * R, y: C.y + y0 * R, width: 0.46 * R, height: (WG.lugTop - 0.80) * R),
                            cornerWidth: R * 0.1, cornerHeight: R * 0.1)
    } }
    for (sx, ang) in [(-1.0, 30.0), (-1.0, -30.0), (1.0, 30.0), (1.0, -30.0), (-1.0, 0.0)] {
        let a = ang * .pi / 180
        let bx = sx * cos(a) * 1.30, by = sin(a) * 1.30
        let rect = CGRect(x: C.x + bx * R - 0.09 * R + sx * 0.07 * R, y: C.y + by * R - 0.075 * R, width: 0.18 * R, height: 0.15 * R)
        lugs.addRoundedRect(in: rect, cornerWidth: R * 0.04, cornerHeight: R * 0.04)
    }
    let caseP = CGMutablePath(); caseP.addPath(lugs); caseP.addPath(circle(WG.caseR))
    ctx.addPath(caseP); ctx.setFillColor(col(0x2A2B2D)); ctx.fillPath()
    ctx.restoreGState()

    linear(caseP, grad([(0, 0x8E9094, 1), (0.45, 0x55575B, 1), (1, 0x232426, 1)]), P(-1.2, 1.2), P(1.2, -1.2))
    let bezel = CGMutablePath(); bezel.addPath(circle(WG.caseR - 0.03)); bezel.addPath(circle(WG.bezelIn))
    ctx.saveGState(); ctx.addPath(bezel); ctx.clip(using: .evenOdd)
    ctx.drawLinearGradient(grad([(0, 0x6B6D71, 1), (0.5, 0x3A3B3E, 1), (1, 0x1C1D1F, 1)]), start: P(-1, 1), end: P(1, -1), options: [])
    ctx.restoreGState()
    ctx.addPath(circle(WG.bezelIn)); ctx.setFillColor(col(0x0A0A0B)); ctx.fillPath()
    ctx.setStrokeColor(col(0xCFD2D6, 0.75))
    for i in 0..<60 {
        let a = Double(i) * .pi / 30, long = i % 5 == 0
        let r0 = long ? 1.215 : 1.235, r1 = 1.265
        ctx.setLineWidth(R * (long ? 0.022 : 0.008))
        ctx.move(to: P(cos(a) * r0, sin(a) * r0)); ctx.addLine(to: P(cos(a) * r1, sin(a) * r1)); ctx.strokePath()
    }
    ctx.setFillColor(col(red)); ctx.fill(CGRect(x: C.x - 0.03 * R, y: C.y + 1.205 * R, width: 0.06 * R, height: 0.07 * R))
    for sx in [-1.0, 1.0] { for sy in [-1.0, 1.0] {
        let p = P(sx * 0.80, sy * 1.17)
        ctx.setFillColor(col(0x1E1F21)); ctx.fillEllipse(in: CGRect(x: p.x - 0.07 * R, y: p.y - 0.07 * R, width: 0.14 * R, height: 0.14 * R))
        ctx.setFillColor(col(0x8C8F93)); ctx.fillEllipse(in: CGRect(x: p.x - 0.05 * R, y: p.y - 0.05 * R, width: 0.10 * R, height: 0.10 * R))
    } }
    if let f = face {
        ctx.saveGState(); ctx.addPath(circle(WG.lensIn)); ctx.clip()
        ctx.draw(f, in: CGRect(x: C.x - R, y: C.y - R, width: 2 * R, height: 2 * R))
        ctx.restoreGState()
    }
    linear(circle(WG.bezelIn), grad([(0, 0xFFFFFF, 0.10), (0.5, 0xFFFFFF, 0.0), (1, 0xFFFFFF, 0.0)]), P(-0.9, 0.9), P(0.2, -0.2))
}

// One watch per image: width 2 x 1.5 R (case + buttons + shadow), height 2 x band R.
func watchImage(_ name: String, capture: String, r R: Double, band: Double) {
    let w = (2 * 1.52 * R).rounded(), h = (2 * band * R).rounded()
    let cv = Canvas(w, h)
    drawWatch(cv, face: cap(capture), cx: w / 2, cyTop: h / 2, r: R, band: band)
    cv.save(name)
}

watchImage("watch_hero.png", capture: "locked", r: 300, band: 1.95)
watchImage("watch_free.png", capture: "locked", r: 190, band: 1.75)
watchImage("watch_unlocked.png", capture: "gym", r: 190, band: 1.75)
