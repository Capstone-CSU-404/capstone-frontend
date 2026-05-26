import { X, TrendingUp } from "lucide-react"

const SkillBadge = ({
  skills = [],
  handleRemoveSkill,
  ai = false,
}) => {

  return (
    <div className="flex flex-wrap gap-2">

      {skills.map((skill, index) => {

        const skillName = ai
          ? skill.skill
          : skill

        const confidence = ai
          ? skill.confidence
          : null

        return (
          <div
            key={index}
            className="
              flex items-center gap-2
              bg-indigo-50 text-indigo-600
              text-xs font-medium
              px-3 py-1.5 rounded-full
              border border-indigo-100/50
              max-w-full
            "
          >

            <span className="truncate capitalize">
              {skillName}
            </span>

            {ai && (
              <span className="
                flex items-center gap-1
                text-[10px]
                bg-white/70
                px-1.5 py-0.5
                rounded-full
              ">

                <TrendingUp className="w-3 h-3" />

                {(confidence * 100).toFixed(0)}%
              </span>
            )}

            {!ai && (
              <button
                type="button"
                onClick={() =>
                  handleRemoveSkill(skill)
                }
                className="
                  hover:text-red-500
                  transition-colors
                  shrink-0
                "
              >
                <X className="w-3 h-3" />
              </button>
            )}

          </div>
        )
      })}
    </div>
  )
}

export default SkillBadge