/* eslint no-unused-vars: "error" */
/* eslint no-undef: "error" */
/* eslint-env browser */
function toggleData() {
  if (document.getElementById('resdetails').style.display === 'none') {
    document.getElementById('resdetails').style.display = 'block';
	document.getElementById('accessData').innerText = 'Afficher les informations renvoyées par FranceConnect';
  } else {
    document.getElementById('resdetails').style.display = 'none';
    document.getElementById('accessData').innerText = 'Cacher les informations renvoyées par FranceConnect';
  }
}
