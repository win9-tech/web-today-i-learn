// TIL 폼 등록 기능
const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");

tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // 입력값 가져오기
  const date = document.querySelector("#til-date").value;
  const title = document.querySelector("#til-title").value;
  const content = document.querySelector("#til-content").value;

  // 새 TIL 항목 생성
  const newItem = document.createElement("article");
  newItem.className = "til-item";
  newItem.innerHTML = `
    <time>${date}</time>
    <h3>${title}</h3>
    <p>${content}</p>
  `;

  // 목록 맨 앞에 추가
  tilList.prepend(newItem);

  // 폼 초기화
  tilForm.reset();
});
