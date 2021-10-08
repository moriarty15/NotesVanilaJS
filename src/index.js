import './sass/main.scss';
import { debounce } from 'lodash';
import render from './handlebars/listEl.hbs';
import { v4 as uuidv4 } from 'uuid';
import * as basicLightbox from 'basiclightbox';

const btnSave = document.querySelector('.save');
const newNotes = document.querySelector('.Notes__input');
const collectionNotes = document.querySelector('.js-menu');
const btnCursive = document.querySelector('.cursive');
const btnHeavy = document.querySelector('.heavy');
const colorText = document.querySelector('.text__color');

if (!localStorage.getItem('myNotes')) {
  const myObj = [
    {
      text: 'create your first note',
      id: uuidv4(),
    },
  ];
  localStorage.setItem('myNotes', JSON.stringify(myObj));
}

btnSave.addEventListener('click', renderList);
newNotes.addEventListener('keydown', debounce(notesTextContent, 200));

let text = '';

function notesTextContent(e) {
  text = e.target.value.trim();
}

let getStore;
function renderList() {
  newNotes.value = ''
  const newNote = {
    text,
    id: uuidv4(),
  };
  if (newNote.text !== '') {
    let arrayNotes = JSON.parse(localStorage.getItem('myNotes'));
    console.log('я пушу');
    arrayNotes.push(newNote);
    localStorage.setItem('myNotes', JSON.stringify(arrayNotes));
  }
  getStore = JSON.parse(localStorage.getItem('myNotes'));
  renderAllNotes()
}
function renderAllNotes() {
  collectionNotes.innerHTML = render({ getStore });

  if (localStorage.getItem('styleHeavy') === 'heavy') {
    const arrayNotesItem = document.querySelectorAll('.notes__item');
    arrayNotesItem.forEach(e => e.classList.add('heavy'));
  }
  if (localStorage.getItem('styleCursive') === 'cursive') {
    const arrayNotesItem = document.querySelectorAll('.notes__item');
    arrayNotesItem.forEach(e => e.classList.add('cursive'));
  }
  if (localStorage.getItem('textColor')) {
    const arrayNotesItem = document.querySelectorAll('.notes__item');
    const getColor = JSON.parse(localStorage.getItem('textColor'));
    arrayNotesItem.forEach(ev => {
      ev.style.color = getColor;
    });
  }
}

renderList();

collectionNotes.addEventListener('click', deleteNote);

function deleteNote(el) {
  if (el.target.textContent === 'delete') {
    const interim = JSON.parse(localStorage.getItem('myNotes'));
    const filtred = interim.filter(e => e.id !== el.path[2].id);
    localStorage.setItem('myNotes', JSON.stringify(filtred));
    getStore = JSON.parse(localStorage.getItem('myNotes'));
    renderAllNotes()
  }

  if (el.target.textContent === 'change') {
    const interim = JSON.parse(localStorage.getItem('myNotes'));
    interim.forEach(e => {
      if (e.id === el.path[2].id) {
        const instance = basicLightbox.create(`<div class="modal">
          <textarea class="textChange">
          </textarea>
            <button class="btnReplace btn">replace</button>
          </div>`);
        instance.show();
        let curText;
        const textChange = document.querySelector('.textChange');
        textChange.textContent = e.text;
        textChange.addEventListener('keydown', debounce(currentText, 200));
        function currentText(evn) {
          if (evn.target.value.trim() === '') return;
          curText = evn.target.value.trim();
        }
        const btnReplace = document.querySelector('.btnReplace');
        btnReplace.addEventListener('click', replaceText);
        function replaceText() {
          e.text = curText;
          localStorage.setItem('myNotes', JSON.stringify(interim));
          getStore = JSON.parse(localStorage.getItem('myNotes'));
          renderAllNotes()
          instance.close();
        }
      }
      return e;
    });
  }
}

// функция изменения стиля на курсив или полужирный
function fooStyles(style) {
  const arrayNotesItem = document.querySelectorAll('.notes__item');
  arrayNotesItem.forEach(e => e.classList.toggle([style]));
}

btnCursive.addEventListener('click', clickCurse);
btnHeavy.addEventListener('click', clickHeavy);
function clickCurse() {
  fooStyles('cursive');
  if (localStorage.getItem('styleCursive') === 'cursive') {
    localStorage.setItem('styleCursive', '');
    return;
  }
  localStorage.setItem('styleCursive', 'cursive');
}
function clickHeavy() {
  fooStyles('heavy');
  if (localStorage.getItem('styleHeavy') === 'heavy') {
    localStorage.setItem('styleHeavy', '');
    return;
  }
  localStorage.setItem('styleHeavy', 'heavy');
}

colorText.addEventListener('change', changeTextColor);

function changeTextColor(e) {
  const textColor = e.target.value;
  localStorage.setItem('textColor', JSON.stringify(textColor));
  const arrayNotesItem = document.querySelectorAll('.notes__item');
  arrayNotesItem.forEach(ev => {
    ev.style.color = textColor;
  });
}
