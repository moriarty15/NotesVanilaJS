import './sass/main.scss';
import { debounce } from 'lodash';
import render from './handlebars/listEl.hbs';
import { v4 as uuidv4 } from 'uuid';
import * as basicLightbox from 'basiclightbox'

const btnSave = document.querySelector('.btn__save');
const newNotes = document.querySelector('.Notes__input');
const collectionNotes = document.querySelector('.js-menu');

if (!localStorage.getItem('myNotes')) {
  const myObj = [
    {
      text: 'Дефолтная заметка(образец)',
      id: uuidv4(),
    },
  ];
  localStorage.setItem('myNotes', JSON.stringify(myObj));
}

btnSave.addEventListener('click', renderList);
newNotes.addEventListener('keydown', debounce(notesTextContent, 200));

let text = '';

function notesTextContent(e) {
  if (e.target.value.trim() === '') return;
  text = e.target.value.trim();
}

let getStore;
function renderList() {
  const newNote = {
    text,
    id: uuidv4(),
  };
  if (newNote.text !== '') {
    let arrayNotes = JSON.parse(localStorage.getItem('myNotes'));
    arrayNotes.push(newNote);
    localStorage.setItem('myNotes', JSON.stringify(arrayNotes));
  }
  getStore = JSON.parse(localStorage.getItem('myNotes'));

  collectionNotes.innerHTML = render({ getStore });
}

collectionNotes.addEventListener('click', deleteNote);

function deleteNote(el) {
  if (el.path[0].textContent === 'delete') {
    const interim = JSON.parse(localStorage.getItem('myNotes'));

    const filtred = interim.filter(e => e.id !== el.path[2].id);
    localStorage.setItem('myNotes', JSON.stringify(filtred));

    getStore = JSON.parse(localStorage.getItem('myNotes'));
    collectionNotes.innerHTML = render({ getStore });
  }

  if (el.path[0].textContent === 'change') {
    const interim = JSON.parse(localStorage.getItem('myNotes'));
    const redact = interim.map(e => {
      if (e.id === el.path[2].id) {
        basicLightbox.create(`
    <div class="modal">
        <input>
        <button>перезаписать</button>
    </div>
`).show()
        e.text = 'default text'
        
      }
      
      return e
    })
    
    localStorage.setItem('myNotes', JSON.stringify(redact));
    getStore = JSON.parse(localStorage.getItem('myNotes'));
    collectionNotes.innerHTML = render({ getStore });
  }
}

renderList();
