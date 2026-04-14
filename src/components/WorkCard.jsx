export default function WorkCard({ work, onClick }) {
  return (
    <div
      onClick={() => onClick(work)}
      className="group relative bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#6c63ff]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative w-full h-52 overflow-hidden">
        {work.thumbnail ? (
          <img
            src={work.thumbnail}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
            <span className="text-5xl font-bold text-white/10">
              {work.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-3 py-1 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30">
            {work.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-base leading-snug">
            {work.title}
          </h3>
          <span className="text-xs text-white/30 shrink-0">{work.year}</span>
        </div>
        <p className="text-sm text-white/40 leading-relaxed line-clamp-2">
          {work.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {work.tools.map((tool) => (
            <span key={tool} className="text-xs px-2 py-1 rounded-md bg-white/[0.05] text-white/30">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}