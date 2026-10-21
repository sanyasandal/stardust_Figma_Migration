/**
 * table — data table (NM1, non-donor module; styled with oneAZ tokens only).
 * Authored: one row per table row, one cell per column. Variant `bordered`.
 * Cells are moved into <td>s, never rebuilt (EW1).
 * @param {Element} block
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement('td');
      while (cell.firstChild) td.append(cell.firstChild);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  block.replaceChildren(table);
}
