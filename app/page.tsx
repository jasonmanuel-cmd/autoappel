import Link from 'next/link'

export default function HoustonLanding() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-block bg-[#1d6ef3] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          Houston Metro Area
        </div>
        <h1 className="text-5xl font-black mb-4 leading-tight">
          AutoAppeal™ <span className="text-[#1d6ef3]">Houston</span>
        </h1>
        <p className="text-xl text-[#8aafd4] mb-2">Traffic Citation Appeal Service</p>
        <p className="text-[#5b7fa6] mb-8 max-w-xl mx-auto">
          Don't pay that ticket. Let AutoAppeal™ fight it for you. Fast, professional citation
          appeals for Houston and the surrounding metro area.
        </p>
        <Link href="/intake" className="btn-primary text-lg px-10 py-4 inline-block">
          Start My Ticket Review →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { step: '1', title: 'Upload Your Citation', desc: 'Securely upload your ticket. We capture all deadlines and court info instantly.' },
          { step: '2', title: 'We Build Your Appeal', desc: 'Our system generates a professional appeal based on your citation details and jurisdiction.' },
          { step: '3', title: 'Track Every Deadline', desc: 'Real-time countdown alerts keep you and our team ahead of every response window.' },
        ].map(s => (
          <div key={s.step} className="card text-center">
            <div className="text-3xl font-black text-[#1d6ef3] mb-3">{s.step}</div>
            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-[#5b7fa6] text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="card border-[#1d6ef3] text-center">
        <div className="text-2xl mb-2">🔴</div>
        <h3 className="font-bold text-[#1d6ef3] mb-1">Red Vault™ Protected</h3>
        <p className="text-[#5b7fa6] text-sm">
          All data is secured under the LAGNAF™ Red Vault™ architecture. Founder authority and
          audit monitoring are active at all times.
        </p>
      </div>
    </div>
  )
}
