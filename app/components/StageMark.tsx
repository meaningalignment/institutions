import { STAGE_LABEL, type Stage } from "../lib/requests";

// A request's stage: a dot in the stage's pipeline colour, and its name. With onClick it
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
      <i className={`req-stage-dot req-strip-${stage}`} aria-hidden="true" />
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
