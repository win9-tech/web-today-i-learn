// TIL 폼 등록 기능
const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");

// TIL 항목 생성 함수
function createTilItem(date, title, content) {
  const newItem = document.createElement("article");
  newItem.className = "til-item";
  newItem.innerHTML = `
    <time>${date}</time>
    <h3>${title}</h3>
    <p>${content}</p>
    <button class="delete-btn">삭제</button>
  `;

  // 삭제 버튼 이벤트
  const deleteBtn = newItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    newItem.remove();
  });

  return newItem;
}

// 폼 제출 이벤트
tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = document.querySelector("#til-date").value;
  const title = document.querySelector("#til-title").value;
  const content = document.querySelector("#til-content").value;

  const newItem = createTilItem(date, title, content);
  tilList.prepend(newItem);

  tilForm.reset();
});

// 기존 항목에도 삭제 기능 추가
document.querySelectorAll(".til-item").forEach(function (item) {
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", function () {
    item.remove();
  });
  item.appendChild(deleteBtn);
});
