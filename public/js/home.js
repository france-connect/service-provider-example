/* eslint-env browser */

function toggleData() { // eslint-disable-line no-unused-vars
  let { display } = document.getElementById('resdetails').style;
  if (!display || display === 'none') {
    document.getElementById('resdetails').style.display = 'block';
    document.getElementById('accessData').innerText = 'Cacher les informations renvoyées par FranceConnect';
  } else {
    document.getElementById('resdetails').style.display = 'none';
    document.getElementById('accessData').innerText = 'Afficher les informations renvoyées par FranceConnect';
  }
}
