import { debounce } from 'lodash';
import render from './handlebars/listEl.hbs';

const btnSave = document.querySelector('.btn__save');
const newNotes = document.querySelector('.Notes__input');
const collectionNotes = document.querySelector('.js-menu');

if (!localStorage.getItem('myNotes')) {
  const myObj = [
  {
    text: 'Дефолтная заметка(образец)',
  },
  ];
  localStorage.setItem('myNotes', JSON.stringify(myObj));
}


btnSave.addEventListener('click', renderList);
newNotes.addEventListener('keydown', debounce(notesTextContent, 200));

const arrayNotes = JSON.parse(localStorage.getItem('myNotes'));

let text = '';

function notesTextContent(e) {
  if (e.target.value.trim() === '') return;
  text = e.target.value.trim();
}

function renderList() {
  const newNote = {
    text,
  };
  if (newNote.text !== '') {
    arrayNotes.push(newNote);
    localStorage.setItem('myNotes', JSON.stringify(arrayNotes))
  }

  localStorage.setItem('myNotes', JSON.stringify(arrayNotes));
  const getStore = JSON.parse(localStorage.getItem('myNotes'));

  collectionNotes.innerHTML = render({ getStore });
}
renderList();
