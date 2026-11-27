import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import CoreText

// Shared vector drawing of a round outdoor watch in the style of a 51 mm titanium multisport watch
// (bezel, black lens border with minute ticks, five buttons, four lug screws, 26 mm silicone band).
// No brand names, no lettering. Coordinates: CoreGraphics y-up, geometry in units of the display radius R.

let sRGB = CGColorSpace(name: CGColorSpace.sRGB)!

func col(_ hex: UInt32, _ a: Double = 1) -> CGColor {
    CGColor(colorSpace: sRGB, components: [Double((hex >> 16) & 255) / 255, Double((hex >> 8) & 255) / 255,
                                           Double(hex & 255) / 255, a])!
}
func grad(_ stops: [(Double, UInt32, Double)]) -> CGGradient {
    CGGradient(colorsSpace: sRGB, colors: stops.map { col($0.1, $0.2) } as CFArray, locations: stops.map { CGFloat($0.0) })!
}
func grad(_ stops: [(Double, UInt32)]) -> CGGradient { grad(stops.map { ($0.0, $0.1, 1.0) }) }

struct WatchStyle {
    var hi: UInt32, light: UInt32, mid: UInt32, dark: UInt32, deep: UInt32      // case metal
    var bandLight: UInt32, bandMid: UInt32, bandDark: UInt32
    var accent: UInt32?                                                        // side accent at 3 o'clock
    var outline: UInt32

    // Carbon grey DLC titanium case, black silicone band
    static let dlc = WatchStyle(hi: 0x9A9692, light: 0x75726E, mid: 0x575552, dark: 0x3C3A38, deep: 0x272625,
                                bandLight: 0x3B3D41, bandMid: 0x26282B, bandDark: 0x0E0F10, accent: nil, outline: 0x141312)
    // Natural titanium case, orange silicone band
    static let titaniumOrange = WatchStyle(hi: 0xE6E2DB, light: 0xC9C4BC, mid: 0xA39E96, dark: 0x6F6A63, deep: 0x4A4743,
                                           bandLight: 0xD27240, bandMid: 0xB85A28, bandDark: 0x6E3013, accent: 0xF0821E, outline: 0x2A2826)
    // Natural titanium case, graphite silicone band
    static let titaniumGraphite = WatchStyle(hi: 0xE6E2DB, light: 0xC9C4BC, mid: 0xA39E96, dark: 0x6F6A63, deep: 0x4A4743,
                                             bandLight: 0x5D656C, bandMid: 0x464D53, bandDark: 0x25292D, accent: nil, outline: 0x2A2826)
    static func named(_ s: String) -> WatchStyle {
        switch s { case "orange": return .titaniumOrange; case "graphite": return .titaniumGraphite; default: return .dlc }
    }
}

struct FaceImage {
    let image: CGImage
    let cx: Double, cy: Double, r: Double     // display circle in image pixels (y down)
    static func load(_ path: String, cx: Double? = nil, cy: Double? = nil, r: Double? = nil) -> FaceImage? {
        guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
              let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { return nil }
        return FaceImage(image: img, cx: cx ?? Double(img.width) / 2, cy: cy ?? Double(img.height) / 2,
                         r: r ?? Double(min(img.width, img.height)) / 2)
    }
}

// Geometry (units of display radius), measured from front product views of the 51 mm model:
// display 38.1 mm, case 51 mm, band 26 mm.
enum G {
    static let caseR = 1.34
    static let bezelOut = 1.31, bezelIn = 1.205
    static let lugTop = 1.445
    static let bandHalf = 0.675
    static let buttonTip = 1.47
    static let screw = (0.80, 1.17)
    // total extent of the drawn watch (for layout): half width incl. buttons, half height of the case incl. lugs
    static let halfWidth = buttonTip
    static let halfHeight = lugTop
}

final class WatchPainter {
    let ctx: CGContext
    let C: CGPoint
    let R: Double
    let st: WatchStyle

    init(_ ctx: CGContext, center: CGPoint, radius: Double, style: WatchStyle) {
        self.ctx = ctx; self.C = center; self.R = radius; self.st = style
    }

    func P(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: C.x + x * R, y: C.y + y * R) }
    func circle(_ r: Double) -> CGPath { CGPath(ellipseIn: CGRect(x: C.x - r * R, y: C.y - r * R, width: 2 * r * R, height: 2 * r * R), transform: nil) }
    func ring(_ r0: Double, _ r1: Double) -> CGPath { let p = CGMutablePath(); p.addPath(circle(r1)); p.addPath(circle(r0)); return p }

    func fillLinear(_ path: CGPath, _ g: CGGradient, _ a: CGPoint, _ b: CGPoint, eo: Bool = false) {
        ctx.saveGState(); ctx.addPath(path); if eo { ctx.clip(using: .evenOdd) } else { ctx.clip() }
        ctx.drawLinearGradient(g, start: a, end: b, options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
        ctx.restoreGState()
    }
    func fillRadial(_ path: CGPath, _ g: CGGradient, r0: Double, r1: Double, eo: Bool = false) {
        ctx.saveGState(); ctx.addPath(path); if eo { ctx.clip(using: .evenOdd) } else { ctx.clip() }
        ctx.drawRadialGradient(g, startCenter: C, startRadius: r0 * R, endCenter: C, endRadius: r1 * R,
                               options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
        ctx.restoreGState()
    }
    // Conic gradient as (degrees counter-clockwise from 3 o'clock, colour); CoreGraphics here has none, so wedges.
    func fillConic(_ path: CGPath, _ stops: [(Double, UInt32)], eo: Bool = false) {
        ctx.saveGState(); ctx.addPath(path); if eo { ctx.clip(using: .evenOdd) } else { ctx.clip() }
        func rgb(_ h: UInt32) -> (Double, Double, Double) { (Double((h >> 16) & 255), Double((h >> 8) & 255), Double(h & 255)) }
        ctx.setShouldAntialias(false)
        let n = 720
        for i in 0..<n {
            let deg = (Double(i) + 0.5) * 360.0 / Double(n)
            var j = 0
            while j < stops.count - 2 && stops[j + 1].0 < deg { j += 1 }
            let (a0, c0) = stops[j], (a1, c1) = stops[j + 1]
            let t = max(0, min(1, (deg - a0) / max(1e-6, a1 - a0)))
            let (r0, g0, b0) = rgb(c0), (r1, g1, b1) = rgb(c1)
            ctx.setFillColor(CGColor(colorSpace: sRGB, components: [(r0 + (r1 - r0) * t) / 255, (g0 + (g1 - g0) * t) / 255, (b0 + (b1 - b0) * t) / 255, 1])!)
            let p = CGMutablePath()
            p.move(to: C)
            p.addArc(center: C, radius: 3 * R, startAngle: (Double(i) - 0.6) * 2 * .pi / Double(n),
                     endAngle: (Double(i) + 1.6) * 2 * .pi / Double(n), clockwise: false)
            p.closeSubpath()
            ctx.addPath(p); ctx.fillPath()
        }
        ctx.setShouldAntialias(true)
        ctx.restoreGState()
    }
    func roundedPolygon(_ pts: [CGPoint], _ radius: Double) -> CGPath {
        let p = CGMutablePath()
        let n = pts.count
        p.move(to: CGPoint(x: (pts[n - 1].x + pts[0].x) / 2, y: (pts[n - 1].y + pts[0].y) / 2))
        for i in 0..<n {
            let a = pts[i], b = pts[(i + 1) % n]
            p.addArc(tangent1End: a, tangent2End: CGPoint(x: (a.x + b.x) / 2, y: (a.y + b.y) / 2), radius: radius)
        }
        p.closeSubpath()
        return p
    }

    // bandLength: how far the band reaches from the centre (Rd units). fade: the band end fades out to transparent
    // over the last 0.45 Rd (false = band simply continues, e.g. off the image edge).
    func drawBand(length: Double, fade: Bool) {
        if fade { ctx.beginTransparencyLayer(auxiliaryInfo: nil) }
        defer {
            if fade {
                ctx.saveGState()
                ctx.setBlendMode(.destinationOut)
                for sy in [1.0, -1.0] {
                    let rect = CGRect(x: C.x - 2 * R, y: C.y + (sy > 0 ? length - 0.5 : -length - 0.5) * R, width: 4 * R, height: 1.0 * R)
                    fillLinear(CGPath(rect: rect, transform: nil), grad([(0, 0x000000, 0.0), (1, 0x000000, 1.0)]),
                               P(0, (length - 0.45) * sy), P(0, (length - 0.02) * sy))
                }
                ctx.restoreGState()
                ctx.endTransparencyLayer()
            }
        }
        for sy in [1.0, -1.0] {
            let y0 = 0.9 * sy, y1 = length * sy
            let rect = CGRect(x: C.x - G.bandHalf * R, y: C.y + min(y0, y1) * R, width: 2 * G.bandHalf * R, height: abs(y1 - y0) * R)
            let path = CGPath(rect: rect, transform: nil)
            fillLinear(path, grad([(0, st.bandDark), (0.06, st.bandMid), (0.3, st.bandLight), (0.55, st.bandLight), (0.86, st.bandMid), (1, st.bandDark)]),
                       P(-G.bandHalf, 0), P(G.bandHalf, 0))
            // the band curves away from the viewer
            fillLinear(path, grad([(0, 0x000000, 0.0), (0.4, 0x000000, 0.0), (1, 0x000000, 0.5)]), P(0, G.lugTop * sy), P(0, (G.lugTop + 0.32) * sy))
            for sx in [-1.0, 1.0] {   // moulded edge highlights
                let hl = CGRect(x: C.x + (sx > 0 ? G.bandHalf - 0.075 : -G.bandHalf + 0.055) * R, y: rect.minY, width: 0.02 * R, height: rect.height)
                fillLinear(CGPath(rect: hl, transform: nil), grad([(0, 0xFFFFFF, 0.0), (0.5, 0xFFFFFF, 0.12), (1, 0xFFFFFF, 0.0)]),
                           P(0, (G.lugTop - 0.25) * sy), P(0, (G.lugTop + 0.3) * sy))
            }
            fillRadial(path, grad([(0, 0x000000, 0.55), (1, 0x000000, 0.0)]), r0: G.caseR - 0.01, r1: G.caseR + 0.09)
        }
    }

    private func button(_ deg: Double) {
        ctx.saveGState()
        ctx.translateBy(x: C.x, y: C.y); ctx.rotate(by: deg * .pi / 180)
        let w = 0.150 * R, x0 = 1.26 * R, x1 = G.buttonTip * R
        let pusher = CGPath(roundedRect: CGRect(x: x0, y: -w / 2, width: x1 - x0, height: w), cornerWidth: 0.035 * R, cornerHeight: 0.035 * R, transform: nil)
        let up = sin(deg * .pi / 180) >= 0 || abs(deg - 180) < 1
        let s = up ? [(0.0, st.deep), (0.18, st.dark), (0.55, st.hi), (0.72, st.light), (1.0, st.mid)]
                   : [(0.0, st.deep), (0.25, st.dark), (0.6, st.light), (0.8, st.hi), (1.0, st.mid)]
        ctx.addPath(pusher); ctx.clip()
        ctx.drawLinearGradient(grad(s), start: CGPoint(x: 0, y: -w / 2), end: CGPoint(x: 0, y: w / 2), options: [])
        ctx.setFillColor(col(0x000000, 0.2)); ctx.fill(CGRect(x: x1 - 0.022 * R, y: -w, width: 0.022 * R, height: 2 * w))
        ctx.setFillColor(col(0x161514, 0.75)); ctx.fill(CGRect(x: 1.37 * R, y: -w, width: 0.014 * R, height: 2 * w))
        ctx.resetClip()
        let cw = 0.19 * R
        let collar = CGPath(roundedRect: CGRect(x: 1.24 * R, y: -cw / 2, width: 0.13 * R, height: cw), cornerWidth: 0.02 * R, cornerHeight: 0.02 * R, transform: nil)
        ctx.addPath(collar); ctx.clip()
        ctx.drawLinearGradient(grad([(0.0, st.dark), (0.35, st.mid), (0.65, st.light), (1.0, st.dark)]),
                               start: CGPoint(x: 0, y: -cw / 2), end: CGPoint(x: 0, y: cw / 2), options: [])
        ctx.restoreGState()
    }

    func casePath() -> CGPath {
        let quad: [(Double, Double)] = [(0.0, 0.0), (1.178, 0.639), (1.085, 0.95), (0.99, 1.26), (0.87, G.lugTop), (G.bandHalf + 0.005, G.lugTop), (G.bandHalf + 0.005, 0.9)]
        var p: CGPath = circle(G.caseR)
        for sx in [1.0, -1.0] { for sy in [1.0, -1.0] {
            p = p.union(roundedPolygon(quad.map { P($0.0 * sx, $0.1 * sy) }, 0.035 * R))
        } }
        return p
    }

    func drawCase() {
        if let acc = st.accent {
            let p = CGMutablePath()
            p.addRelativeArc(center: C, radius: 1.385 * R, startAngle: -0.36, delta: 0.72)
            p.addRelativeArc(center: C, radius: 1.25 * R, startAngle: 0.36, delta: -0.72)
            p.closeSubpath()
            fillLinear(p, grad([(0, acc), (0.5, acc), (1, 0x9A4410)]), P(1.25, 0.4), P(1.40, -0.4))
        }
        for d in [150.0, 180.0, 210.0, 30.0, -30.0] { button(d) }
        let cp = casePath()
        fillConic(cp, [(0, st.mid), (40, st.dark), (95, st.light), (135, st.hi), (175, st.light), (220, st.dark), (260, st.deep),
                       (300, st.mid), (330, st.light), (360, st.mid)])
        fillLinear(cp, grad([(0, 0xFFFFFF, 0.10), (0.5, 0xFFFFFF, 0.0), (1, 0x000000, 0.18)]), P(-1.2, 1.2), P(1.2, -1.2))
        ctx.saveGState()
        ctx.addPath(cp); ctx.clip()
        ctx.addPath(cp); ctx.setLineWidth(0.05 * R); ctx.replacePathWithStrokedPath(); ctx.clip()
        ctx.drawLinearGradient(grad([(0, 0xFFFFFF, 0.5), (0.45, 0xFFFFFF, 0.0), (0.55, 0x000000, 0.0), (1, 0x000000, 0.45)]),
                               start: P(-1.1, 1.1), end: P(1.1, -1.1), options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
        ctx.restoreGState()
        ctx.saveGState(); ctx.addPath(cp); ctx.clip()
        ctx.addPath(cp); ctx.setStrokeColor(col(st.outline, 0.6)); ctx.setLineWidth(0.012 * R); ctx.strokePath()
        ctx.restoreGState()
        // lug end chamfers
        for sx in [1.0, -1.0] { for sy in [1.0, -1.0] {
            let x0 = min(sx * (G.bandHalf + 0.005), sx * 0.9), w = 0.9 - G.bandHalf - 0.005
            let strip = CGRect(x: C.x + x0 * R, y: C.y + (sy > 0 ? G.lugTop - 0.035 : -G.lugTop) * R, width: w * R, height: 0.035 * R)
            ctx.saveGState(); ctx.addPath(cp); ctx.clip()
            ctx.setFillColor(col(sy > 0 ? 0xFFFFFF : 0x000000, sy > 0 ? 0.16 : 0.22)); ctx.fill(strip)
            ctx.restoreGState()
        } }
        // screws
        for sx in [1.0, -1.0] { for sy in [1.0, -1.0] {
            let c = P(G.screw.0 * sx, G.screw.1 * sy)
            let r = 0.058 * R
            ctx.setFillColor(col(0x1E1D1C, 0.85)); ctx.fillEllipse(in: CGRect(x: c.x - r, y: c.y - r, width: 2 * r, height: 2 * r))
            let rh = r * 0.8
            let head = CGPath(ellipseIn: CGRect(x: c.x - rh, y: c.y - rh, width: 2 * rh, height: 2 * rh), transform: nil)
            fillLinear(head, grad([(0, st.hi), (0.5, st.mid), (1, st.dark)]), CGPoint(x: c.x - rh, y: c.y + rh), CGPoint(x: c.x + rh, y: c.y - rh))
            let hex = CGMutablePath()
            for i in 0..<6 {
                let a = Double(i) * .pi / 3 + .pi / 6
                let q = CGPoint(x: c.x + cos(a) * rh * 0.45, y: c.y + sin(a) * rh * 0.45)
                if i == 0 { hex.move(to: q) } else { hex.addLine(to: q) }
            }
            hex.closeSubpath()
            ctx.addPath(hex); ctx.setFillColor(col(0x232120)); ctx.fillPath()
        } }
        fillRadial(ring(G.bezelOut - 0.005, G.bezelOut + 0.022), grad([(0, 0x000000, 0.55), (1, 0x000000, 0.0)]), r0: G.bezelOut, r1: G.bezelOut + 0.022, eo: true)
    }

    func drawBezelAndLens() {
        let bezel = ring(G.bezelIn, G.bezelOut)
        fillConic(bezel, [(0, st.light), (35, st.mid), (70, st.light), (115, st.hi), (150, st.hi), (195, st.mid), (235, st.dark), (275, st.mid),
                          (310, st.light), (335, st.hi), (360, st.light)], eo: true)
        ctx.saveGState(); ctx.addPath(bezel); ctx.clip(using: .evenOdd)
        var rr = G.bezelIn + 0.004, k = 0
        while rr < G.bezelOut {
            ctx.addPath(circle(rr)); ctx.setStrokeColor(col(k % 2 == 0 ? 0xFFFFFF : 0x000000, 0.035)); ctx.setLineWidth(0.004 * R); ctx.strokePath()
            rr += 0.0085; k += 1
        }
        ctx.restoreGState()
        fillLinear(ring(G.bezelOut - 0.014, G.bezelOut), grad([(0, 0xFFFFFF, 0.6), (0.5, 0xFFFFFF, 0.1), (1, 0x000000, 0.25)]), P(-1, 1), P(1, -1), eo: true)
        fillLinear(ring(G.bezelIn, G.bezelIn + 0.02), grad([(0, 0x000000, 0.45), (0.5, 0xFFFFFF, 0.1), (1, 0xFFFFFF, 0.55)]), P(-1, 1), P(1, -1), eo: true)
        for sy in [1.0, -1.0] {
            let nw = 0.045 * R
            let notch = CGRect(x: C.x - nw / 2, y: C.y + (sy > 0 ? G.bezelIn + 0.03 : -G.bezelOut) * R, width: nw, height: (G.bezelOut - G.bezelIn - 0.03) * R)
            ctx.setFillColor(col(st.deep, 0.95)); ctx.fill(notch)
            ctx.setFillColor(col(0xFFFFFF, 0.22)); ctx.fill(CGRect(x: notch.minX, y: notch.minY, width: 0.006 * R, height: notch.height))
        }
        // black lens border with minute ticks
        fillRadial(circle(G.bezelIn), grad([(0, 0x060708), (0.85, 0x0E0F11), (1, 0x1B1D20)]), r0: 1.0, r1: G.bezelIn)
        for i in 0..<60 {
            ctx.saveGState(); ctx.translateBy(x: C.x, y: C.y); ctx.rotate(by: Double(i) * .pi / 30)
            if i % 5 == 0 {
                ctx.setFillColor(col(0x8A8D91)); ctx.fill(CGRect(x: 1.105 * R, y: -0.013 * R, width: 0.07 * R, height: 0.026 * R))
                ctx.setFillColor(col(0x0E0F11)); ctx.fill(CGRect(x: 1.113 * R, y: -0.0065 * R, width: 0.054 * R, height: 0.013 * R))
            } else {
                ctx.setFillColor(col(0x4A4D51)); ctx.fill(CGRect(x: 1.145 * R, y: -0.005 * R, width: 0.03 * R, height: 0.010 * R))
            }
            ctx.restoreGState()
        }
    }

    func drawFace(_ face: FaceImage?) {
        if let f = face {
            let k = R / f.r
            let w = Double(f.image.width), h = Double(f.image.height)
            let rect = CGRect(x: C.x - k * f.cx, y: C.y + k * f.cy - k * h, width: k * w, height: k * h)
            ctx.saveGState(); ctx.addPath(circle(1.0)); ctx.clip()
            ctx.interpolationQuality = .high
            ctx.draw(f.image, in: rect)
            ctx.restoreGState()
        } else {
            fillRadial(circle(1.0), grad([(0, 0xEDEAE3), (1, 0xD9D4C9)]), r0: 0, r1: 1)
        }
        fillRadial(circle(1.0), grad([(0, 0x000000, 0.0), (1, 0x000000, 0.28)]), r0: 0.955, r1: 1.0)
    }

    func drawGlass(_ amount: Double) {
        guard amount > 0 else { return }
        fillLinear(circle(G.bezelIn), grad([(0, 0xFFFFFF, amount), (1, 0xFFFFFF, 0.0)]), P(-0.85, 0.85), P(0.05, -0.05))
    }

    // Complete watch: band, case, bezel, lens, face.
    func drawWatch(face: FaceImage?, bandLength: Double, bandFade: Bool, glass: Double = 0.05) {
        drawBand(length: bandLength, fade: bandFade)
        drawCase()
        drawBezelAndLens()
        drawFace(face)
        drawGlass(glass)
    }
}

// ---------------------------------------------------------------- bitmap helpers

func makeContext(_ w: Int, _ h: Int) -> CGContext {
    CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: sRGB,
              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
}

// Downsamples a supersampled image to w x h and returns an opaque RGB image.
func downsample(_ img: CGImage, _ w: Int, _ h: Int) -> CGImage {
    let c = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: sRGB,
                      bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    c.interpolationQuality = .high
    c.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
    return c.makeImage()!
}

func writePNG(_ img: CGImage, _ path: String) {
    let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, img, nil)
    guard CGImageDestinationFinalize(dest) else { fatalError("write \(path)") }
}

func parseArgs() -> [String: String] {
    var o: [String: String] = [:]
    for a in CommandLine.arguments.dropFirst() {
        let kv = a.split(separator: "=", maxSplits: 1).map(String.init)
        if kv.count == 2 { o[kv[0]] = kv[1] }
    }
    return o
}
