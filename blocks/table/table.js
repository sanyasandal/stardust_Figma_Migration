/* Table — oneAZ table (header Forms Border 2, rows Supporting 2 / Supporting 1) */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const table = document.createElement('table');
  const hasHeader = !block.classList.contains('no-header');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const isHead = hasHeader && i === 0;
    [...row.children].forEach((cell) => {
      const td = document.createElement(isHead ? 'th' : 'td');
      if (isHead) td.scope = 'col';
      td.append(...cell.childNodes);
      tr.append(td);
    });
    (isHead ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll';
  wrapper.append(table);
  block.replaceChildren(wrapper);
}
