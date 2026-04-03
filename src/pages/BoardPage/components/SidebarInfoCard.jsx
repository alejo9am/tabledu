function SidebarInfoCard({ title, description, buttonLabel, onConfirm, sectionAriaLabelId }) {
  return (
    <section className="board-sidebar__section board-sidebar__turn" aria-labelledby={sectionAriaLabelId}>
      <h2 id={sectionAriaLabelId} className="board-sidebar__turn-title">{title}</h2>
      {description && <p className="board-sidebar__turn-description">{description}</p>}
      <button className="board-sidebar__turn-button" onClick={onConfirm}>{buttonLabel}</button>
    </section>
  )
}

export default SidebarInfoCard
