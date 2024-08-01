import { Component } from "react";
import "./Card.css";

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
 * общий интерфейс с кнопкой удалить
 * @interface NoteProps
 * @property {NoteTable} note сама заметка
 * @property onDelete: () => void; - удаление заметки
 */
interface NoteProps {
    note: NoteTable;
    onDelete: () => void;
}

/**
 * классовый компонент для 1 карточки
 * @class Card
 */
class Card extends Component<NoteProps> {
    
    /**
     * рендер компонент
     * @metod render
     * @returns {JSX.Element} JSX элемент для отображения компонента
     */
    render(): JSX.Element {
        const { note, onDelete } = this.props;
        return (
            <div className="note-card">
                <div className="note-delete" onClick={onDelete}></div>
                <p className="note-text">{note.text}</p>
            </div>
        )
    }
}

export default Card;