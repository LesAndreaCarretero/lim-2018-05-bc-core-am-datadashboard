//Antes de comenzar con funciones; se declaran variables para traer los 'id´s' de html
const listVenues = document.querySelector('#venues');
const mainSection = document.getElementById('cohorts');
const showUsersandProgress = document.getElementById('users');
const content = document.getElementById('selectsede');
const buttonOrder=  document.getElementById('orderButton');
const selectAscDesc= document.getElementById('orderII');
const selectAll= document.getElementById('order');
//Objeto global "options" :
let options = {
  cohort: null,
  cohortData: {
    users: null,
    progress: null,
  },
  orderBy: '',
  orderDirection: 'ASC',
  search: ''
}
// se utiliza xhr- 
const getData = (str, url, callback) => { 
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.addEventListener('load', event => {
    if (event.target.readyState === 4 && event.target.status === 200) {
      const response = (JSON.parse(event.target.responseText));
      callback(str, response);
    }
  });
  xhr.send();
}
// Mostrar cohorts-
const viewCohorts = (city, dataCohorts) => {
  options.cohort = dataCohorts;
  let cohortByCity = dataCohorts.filter(cohort => {
    return cohort.id.indexOf(city) !== -1;
  })
 content.innerHTML = '';
 for(cohort of cohortByCity){
    content.innerHTML +=
      `<button style="background-color: rgb(255, 229, 33)" id="${cohort.id}">${cohort.id}</button>`
  };
};
// Aquí se llama a progreso
const viewProgress = (idOfCohorts, progressObject) => {
  options.cohortData.progress = progressObject;
  const array= processCohortData(options);
    console.log(array);
  for(const students of array){
    showUsersandProgress.innerHTML+=
    `<div id= "tablestudent">
             <td >${students.name}</td>
             <td>${students.stats.percent}</td> 
             <td>${students.stats.exercises.percent}</td>
             <td>${students.stats.quizzes.percent}</td>
             <td>${students.stats.quizzes.scoreSum}</td>
             <td>${students.stats.quizzes.scoreAvg}</td>
             <td>${students.stats.reads.percent}</td>
             </div>`;
  }
}
//Aquí se llamará a Users
const viewUsers = (idOfCohorts, usersArray) => {
    options.cohortData.users = usersArray;
  getData(idOfCohorts,`../data/cohorts/${idOfCohorts}/progress.json`,viewProgress);
}
//Variable para pintar en pantalla
const showAll=(usersAndProgress)=>{
  for(const students of usersAndProgress){
    showUsersandProgress.innerHTM += `<tr>` +
    `<div id= "tablestudent">
    <td >${students.name}</td>
    <td>${students.stats.percent}</td> 
    <td>${students.stats.exercises.percent}</td>
    <td>${students.stats.quizzes.percent}</td>
    <td>${students.stats.quizzes.scoreSum}</td>
    <td>${students.stats.quizzes.scoreAvg}</td>
    <td>${students.stats.reads.percent}</td>
    </div>`;
  }
}
// Se agrega evento correspondiente
//2do
listVenues.addEventListener('click', event => {
  getData(event.target.id, '../data/cohorts.json', viewCohorts);
});
// 4to
content.addEventListener('click', (event) => {
     options.cohort.forEach((elementOfCohort) => { 
      if (elementOfCohort.id === event.target.id){ 
          options.cohort= elementOfCohort;
          console.log(options);
      }
  }); 
getData(event.target.id,`../data/cohorts/${event.target.id}/users.json`, viewUsers)
});
//Agregando evento para función número 2- Sort
buttonOrder.addEventListener('click', (event) => {
  options.orderBy = selectAll.value;
  options.orderDirection = selectAscDesc.value;
  const newOrder = sortUsers(processCohortData(options),options.orderBy,options.orderDirection);
   let orderNow= processCohortData(options);
   showUsersandProgress.innerHTML= '';
   for(let users of orderNow){
     showUsersandProgress.innerHTML+=
  ` <th
     <td scope="row">${users['name']}</td>
     <td scope="row">${users.stats.percent}</td> 
     <td scope="row">${users.stats.exercises.percent}</td>
     <td scope="row">${users.stats.quizzes.percent}</td>
     <td scope="row">${users.stats.quizzes.scoreSum}</td>
     <td scope="row">${users.stats.quizzes.scoreAvg}</td>
     <td scope="row">${users.stats.reads.percent}</td>
     </th>`;
   };
})
// Aplicando 3era funciónn para filtrar estudiantes
filterSearch.addEventListener('keyup', (event) => { 
  options.search = event.target.value;
  const searchNow= processCohortData(options); // Aquí se almacenará el nuevo array 
  showUsersandProgress.innerHTML= '';
  for(let users of searchNow){
    showUsersandProgress.innerHTML+=
 `<div id= 'tablestudentIII'>
		<td >${users['name']}</td>
		<td>${users.stats.percent}</td> 
    <td>${users.stats.exercises.percent}</td>
    <td>${users.stats.quizzes.percent}</td>
    <td>${users.stats.quizzes.scoreSum}</td>
    <td>${users.stats.quizzes.scoreAvg}</td>
    <td>${users.stats.reads.percent}</td>
		</div>`;
	};
})