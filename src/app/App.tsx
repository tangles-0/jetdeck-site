import { Terminal, Cpu, Wifi, Battery, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useState, useEffect } from 'react';
import { ProductCarousel } from './components/ProductCarousel';

import prototypeImage1 from '../assets/P1090575.JPG';
import prototypeImage2 from '../assets/P1090576.JPG';
import prototypeImage3 from '../assets/P1090578.JPG';
import prototypeImage4 from '../assets/P1090582.JPG';
import prototypeImage5 from '../assets/P1090583.JPG';
import prototypeImage6 from '../assets/P1090584.JPG';
import renderImage1 from '../assets/CD-Front-01.jpg';
import renderImage2 from '../assets/CD-Back-01.jpg';
import renderImage3 from '../assets/CD-Side-01.jpg';
import renderImage4 from '../assets/CD-Side-02.jpg';
import pcbImage1 from '../assets/P1090588.JPG';
import pcbImage2 from '../assets/P1090589.JPG';

import discordLogo from "../assets/discord.png";

const prototypeImages = [
  { src: prototypeImage1, alt: "JetDeck SCOUT - Front View" },
  { src: prototypeImage2, alt: "JetDeck SCOUT - Front View Close" },
  { src: prototypeImage3, alt: "JetDeck SCOUT - Right Side View" },
  { src: prototypeImage4, alt: "JetDeck SCOUT - Left Side View" },
  { src: prototypeImage5, alt: "JetDeck SCOUT - GPIO View" },
  { src: prototypeImage6, alt: "JetDeck SCOUT - Back View" },
];

const renderImages = [
  { src: renderImage1, alt: "JetDeck SCOUT - CD Back View" },
  { src: renderImage2, alt: "JetDeck SCOUT - CD Front View" },
  { src: renderImage3, alt: "JetDeck SCOUT - CD Side View" },
  { src: renderImage4, alt: "JetDeck SCOUT - CD Side View" },
];

const pcbImages = [
  { src: pcbImage1, alt: "JetDeck SCOUT - PCB Back View" },
  { src: pcbImage2, alt: "JetDeck SCOUT - PCB Front View" },
]

export default function App() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6"
            onClick={() => window.open('https://www.kickstarter.com/projects/jetdeck/jetdeck-scout-the-smart-cyber-ops-utility-tool', '_blank')}>
              <Terminal className="size-4" />
              <span>Now Live on Kickstarter</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-mono mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              JetDeck SCOUT
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-2 font-mono">
              Smart Cyber Ops Utility Tool
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mb-8">
              The ultimate handheld Linux computer for hackers, makers, and mobile operations
            </p>
            <div className="flex flex-row gap-2">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
              asChild
            >
              <a href="https://www.kickstarter.com/projects/jetdeck/jetdeck-scout-the-smart-cyber-ops-utility-tool" target="_blank" rel="noopener noreferrer">
                Back on Kickstarter
                <ExternalLink className="ml-2 size-5" />
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
              asChild
            >
              <a href="https://discord.gg/nX8wnxfAyx" target="_blank" rel="noopener noreferrer">
                Join Discord
                <img src={discordLogo} alt="Discord" className="size-8" />
              </a>
            </Button>
            </div>
          </div>


          <ProductCarousel images={prototypeImages} />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Cpu className="size-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-mono text-cyan-400">CM5</div>
                <div className="text-sm text-slate-500">Raspberry Pi</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Battery className="size-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-mono text-green-400">8000mAh</div>
                <div className="text-sm text-slate-500">Battery</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Wifi className="size-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-mono text-purple-400">WiFi 6</div>
                <div className="text-sm text-slate-500">+ BT 5</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Zap className="size-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-mono text-yellow-400">USB-C PD</div>
                <div className="text-sm text-slate-500">bi-directional charging</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Description Section */}
        <section className="container mx-auto px-4 pb-12 md:pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-mono mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              &gt; What is the JetDeck SCOUT?
            </h2>
            <div className="prose prose-invert prose-cyan max-w-none">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardContent className="p-8">
                  <p className="text-lg text-slate-300 leading-relaxed mb-4">
                    The JetDeck SCOUT is a compact, portable cyberdeck designed for professionals and enthusiasts who need serious computing power on the go. Built around the powerful Raspberry Pi CM5, it's the perfect tool for penetration testing, mesh networking, IoT development, and retro gaming.
                  </p>
                  <p className="text-lg text-slate-300 leading-relaxed mb-4">
                    With its integrated display, full QWERTY keyboard, gamepad controls, and extensive connectivity options, the SCOUT puts a complete Linux workstation in the palm of your hand. Whether you're debugging code in the field, running network diagnostics, connecting to Meshtastic networks, or enjoying classic games, the SCOUT has you covered.
                  </p>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    The SCOUT features premium components including a high-quality audio DAC with 5W amplifier, NFC reader/writer, NVMe SSD support, and optional 4G/LTE connectivity. The aluminum housing with integrated cooling ensures your device stays cool during intensive tasks, while the 8000mAh battery provides all-day runtime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <ProductCarousel images={renderImages} />

        {/* Technical Specs Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 mb-12 bg-slate-950/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-mono mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              &gt; Technical Specifications
            </h2>
            
            <Tabs defaultValue="compute" className="w-full">
              <TabsList className="w-full bg-slate-900/50 mb-8 flex flex-wrap md:grid md:grid-cols-5 h-auto gap-2 p-2">
                <TabsTrigger value="compute" className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0">Compute</TabsTrigger>
                <TabsTrigger value="connectivity" className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0">Connectivity</TabsTrigger>
                <TabsTrigger value="peripherals" className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0">Peripherals</TabsTrigger>
                <TabsTrigger value="power" className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0">Power</TabsTrigger>
                <TabsTrigger value="physical" className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0">Physical</TabsTrigger>
              </TabsList>

              <TabsContent value="compute">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">Compute Core</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Processor</td>
                          <td className="py-2 pl-4 text-slate-200">Raspberry Pi CM5 (CM4 compatible*)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Cooling</td>
                          <td className="py-2 pl-4 text-slate-200">Aluminum rear housing + integrated fan</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Storage</td>
                          <td className="py-2 pl-4 text-slate-200">NVMe M-key slot for 2230 SSD</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">MicroSD</td>
                          <td className="py-2 pl-4 text-slate-200">TF / MicroSD card slot (CM5 without MMC)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">MCU</td>
                          <td className="py-2 pl-4 text-slate-200">RP2040 MCU</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="connectivity">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">Connectivity</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Display Output</td>
                          <td className="py-2 pl-4 text-slate-200">Mini-HDMI 2.0</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">USB 3.0</td>
                          <td className="py-2 pl-4 text-slate-200">1x USB-C port 5Gbps (CM5 only*)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">USB 2.0</td>
                          <td className="py-2 pl-4 text-slate-200">3x ports (1x USB-C, 1x USB-A external, 1x USB-A internal)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Ethernet</td>
                          <td className="py-2 pl-4 text-slate-200">10/100/1000 Mbps RJ45</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Audio</td>
                          <td className="py-2 pl-4 text-slate-200">3.5mm headphone jack, S/PDIF out</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Wireless</td>
                          <td className="py-2 pl-4 text-slate-200">WiFi 6 / BT 5 (with wireless CM variant)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">NFC</td>
                          <td className="py-2 pl-4 text-slate-200">NFC reader / writer</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">GPIO</td>
                          <td className="py-2 pl-4 text-slate-200">40-pin Raspberry Pi header (top edge)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Infrared</td>
                          <td className="py-2 pl-4 text-slate-200">940nm TX/RX</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">MIPI</td>
                          <td className="py-2 pl-4 text-slate-200">2x 4-lane (camera and display)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Optional 4G/LTE</td>
                          <td className="py-2 pl-4 text-slate-200">WWAN module + micro SIM slot</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="peripherals">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">Onboard Peripherals</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Display</td>
                          <td className="py-2 pl-4 text-slate-200">4.3" 800x480 IPS</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Camera</td>
                          <td className="py-2 pl-4 text-slate-200">5MP 72-degree with autofocus</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Keyboard</td>
                          <td className="py-2 pl-4 text-slate-200">Backlit full QWERTY (QMK firmware)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Gamepad</td>
                          <td className="py-2 pl-4 text-slate-200">Nintendo Switch-style joystick (mouse control)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Audio</td>
                          <td className="py-2 pl-4 text-slate-200">High-quality DAC, Class-D 5W amplifier</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Speakers</td>
                          <td className="py-2 pl-4 text-slate-200">High-quality stereo speakers</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Volume Control</td>
                          <td className="py-2 pl-4 text-slate-200">Tactile analog wheel</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Torch</td>
                          <td className="py-2 pl-4 text-slate-200">High brightness LED</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="power">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">Power & Charging</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Battery</td>
                          <td className="py-2 pl-4 text-slate-200">8000mAh Li-ion (2S configuration)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Charging</td>
                          <td className="py-2 pl-4 text-slate-200">Bi-directional up to PD 27W</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Output (future)</td>
                          <td className="py-2 pl-4 text-slate-200">100W supported by hardware*</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Accessory Power</td>
                          <td className="py-2 pl-4 text-slate-200">6 amp 5V and 3.3V rails</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Included Cable</td>
                          <td className="py-2 pl-4 text-slate-200">USB-C with voltage/amps/watts display</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="physical">
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-mono">Physical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-slate-800">
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Dimensions</td>
                          <td className="py-2 pl-4 text-slate-200">110W x 160H x 18D mm</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Weight</td>
                          <td className="py-2 pl-4 text-slate-200">260g</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-400 w-1/3">Included Accessories</td>
                          <td className="py-2 pl-4 text-slate-200">USB-C cable, Philips screwdriver, Microfibre bag</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <ProductCarousel images={pcbImages} noEffect />

        {/* About Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-mono mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              &gt; About the Creator
            </h2>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-8">
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  Hey there! I'm a hardware hacker and maker passionate about creating portable, powerful computing solutions. The JetDeck SCOUT is the culmination of years of tinkering with cyberdecks, embedded systems, and mobile computing platforms.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  I built the SCOUT because I wanted a device that could truly do it all – from running security audits and network diagnostics to serving as a development platform for IoT projects and mesh networks. As a member of the maker and hacker community, I know how important it is to have tools that are both powerful and portable.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  This project is designed to be hackable, extensible, and community-driven. I can't wait to see what you build with the SCOUT. If you're interested in supporting this project, please check out our Kickstarter campaign. Your backing helps bring this vision to life and supports the open-source hardware community.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-mono mb-4 text-cyan-400">
                Ready to Join the Revolution?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Back the JetDeck SCOUT on Kickstarter today and be among the first to receive this powerful handheld Linux computer.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
                asChild
              >
                <a href="https://www.kickstarter.com/projects/jetdeck/jetdeck-scout-the-smart-cyber-ops-utility-tool" target="_blank" rel="noopener noreferrer">
                  Back on Kickstarter Now
                  <ExternalLink className="ml-2 size-5" />
                </a>
              </Button>
              <p className="text-sm text-slate-500 mt-4">Starting at $275 AUD (excl. CM5)</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 font-mono text-sm">
            <p>&gt; JetDeck SCOUT © 2026</p>
            <p className="mt-2">Built for hackers, makers, and dreamers.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}