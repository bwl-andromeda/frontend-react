import "./Notes.css";
import Card from "../Card/Card";
import { Component } from "react";
import { v4 as uuidv4 } from 'uuid';


/**
 * интерфейс для списка
 * @interface NoteTable
 * @property {string} id уникальный номер каждой карточки
 * @property {string} text текст карточки
 */
export interface NoteTable {
    id: string;
    text: string;
}

/**
 * состаяние Notes
 * @interface NoteState
 * @property {NoteTable[]} notes массив заметок
 * @property {string} cardText текст заметки
 * @property {boolean} isLoading состояние загрузки
 */
interface NotesState {
    notes: NoteTable[];
    cardText: string;
    isLoading: boolean;
}

// URL для получения и отправки заметок
const notesUrl = import.meta.env.VITE_NOTES_URL
console.log('Notes URL:', notesUrl);

/**
 * класс Notes отображает список всех карточек
 * @class Notes
 * @extends {Component<{}, NotesState>}
 */
class Notes extends Component<{}, NotesState> {
    state: NotesState = {
        notes: [],
        cardText: '',
        isLoading: false,
    }

    /**
     * удаление компонента после его добавления
     * @metod componentDidMount
     */
    async componentDidMount() {
        await this.loadNotes();
    }

    /**
     * медот для запроса
     * @method fetchRequest
     * @param {string} url - URL запроса
     * @param {string} method - медот запроса: GET, POST и др.
     * @param {any} headers - заголовок запроса
     * @param {any} body - тело запроса
    * @returns {Promise<Response | undefined>} - промис с ответом или undefined в случае ошибки
    */
    async fetchRequest(url: string | undefined, method: string, headers: any, body: any) {
        try {
            if (!url) { throw new Error('URL is not defined'); }

            // Создаем пустой объект для опций запроса
            const options: any = {};

            if (method) { options.method = method; }
            if (body) { options.body = body; }
            if (headers != null) { options.headers = headers; }

            const response = await fetch(url, options);
            if (!response.ok) { throw new Error('HTTP Error ' + response.status); }

            return response;
        } catch (error) { console.error(error); }
    }

    /**
     * загрузка компонентов
     * @method loadNotes
     */
    async loadNotes() {
        try {
            const response = await this.fetchRequest(notesUrl, 'GET', null, null);
            if (!response) return;

            const notes = await response.json();
            this.setState({ notes: notes.notes, isLoading: true });
        } catch (error) {
            console.error("Ошибка", error);
            this.setState({ isLoading: false });
    }}


    /**
     * Метод для добавления новой заметки на сервер
     * @method addNote
     */
    async addNode() {
        const { cardText } = this.state;

        const newNote: NoteTable = {
            id: uuidv4(),
            text: cardText,
        };

        this.setState({ cardText: '' })

        await this.fetchRequest(notesUrl, 'POST', {
            'Content-Type': 'application/json',
            }, JSON.stringify(newNote));

        await this.loadNotes();
    }

    /**
     * метод удаления заметки по id
     * @method removeNote
    * @param {string} id - идентификатор заметки
     */
    async removeNote(id: string) {
        await this.fetchRequest(`${notesUrl}/${id}`, 'DELETE', null, null)
        await this.loadNotes();
    }

    /**
     * Метод для обновления заметок с сервера
     * @method refreshNotes
     */
    async refreshNotes() {
        await this.loadNotes();
    }

    /**
     * медот для всех компонентов
     * @metod render
     * @returns {JSX.Element} JSX элемент для отображения компонента
     */
    render(): JSX.Element {
        const { notes, cardText, isLoading } = this.state;
        return (
            <div className="container-note">
                {!isLoading ? (<div className="loading"></div>) : (
                    <div className="notes-component">
                        <div className="notes-container">
                            <div className="notes-name">Notes</div>
                            <div className="notes-update" onClick={this.refreshNotes.bind(this)}></div>
                        </div>
                        <div className="notes-card">
                            {notes.map((note) => (
                                <Card
                                key={note.id}
                                note={note}
                                onDelete={() => this.removeNote(note.id)}
                                />
                            ))}
                        </div>
                        <div className="notes-form">
                            <p className="notes-form-name">New Note</p>
                            <textarea
                                className="notes-form-text"
                                value={cardText}
                                onChange={(e) => this.setState({ cardText: e.target.value })} 
                            />
                            <div className="notes-form-add"
                            onClick={() => this.addNode()}></div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Notes;