const search = document.querySelector('.search');
const btn = document.querySelector('.btn');
const input = document.querySelector('.input');


btn.addEventListener('click', () => {
  search.classList.toggle('active');
  input.focus();
});

input.addEventListener('input', () => {
  const query = input.value.trim().toLowerCase();
  const filteredTeachers = teachers.filter(teacher => teacher.toLowerCase().includes(query));
  displayTeachers(filteredTeachers);
});

function toggleTeacherList() {
  var teacherList = document.getElementById('teacherList');
  teacherList.classList.toggle('hidden');
}
