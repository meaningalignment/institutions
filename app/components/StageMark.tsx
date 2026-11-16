import { STAGES, STAGE_LABEL, type Stage } from "../lib/requests";

// A request's stage: four pips, one filled per step past "Design wanted"
// (in design, designed, tested, in use), and its name. With onClick it
// is a button (the row's stage filters the list; the summary line toggles it).
export function StageMark({
  stage,
  count,
  onClick,
  active,
  title,
}: {
  stage: Stage;
  count?: number;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  const body = (
    <>
      <span className="req-stage-pips" aria-hidden="true">
        {STAGES.slice(1).map((s, i) => (
          <i key={s} className={i < STAGES.indexOf(stage) ? "is-on" : ""} />
        ))}
      </span>
      {STAGE_LABEL[stage]}
      {count != null && <span className="req-stage-count">{count}</span>}
    </>
  );
  const cls = `req-stage-mark req-stage-${stage}${active ? " is-active" : ""}`;
  return onClick ? (
    <button type="button" className={cls} onClick={onClick} title={title} aria-pressed={active}>
      {body}
    </button>
  ) : (
    <span className={cls}>{body}</span>
  );
}
