import { Component } from 'react';
import './Clock.css';

/**
 * Свойства для компонента Clock
 * @interface ClockProps
 */
interface ClockProps {
    name: string;
    timeZoneOffset: number;
    onDelete: () => void;
}

/**
 * Состояние для компонента Clock
 * @interface ClockState
 */
interface ClockState {
    currentTime: Date;
}

/**
 * @class класс по отображению времени.
 * @extends {Component<ClockProps, ClockState>}
 */
class Clock extends Component<ClockProps, ClockState> {
    intervalID: number | null = null;

    /**
     * Инициализация состояния компонента Clock
     * @type {ClockState}
     */
    state: ClockState = {
        currentTime: new Date(),
    };

    componentDidMount() {
        this.intervalID = Number(setInterval(this.tick, 1000));
    }

    componentWillUnmount() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
        }
    }

    tick = () => {
        const { timeZoneOffset } = this.props;
        const currentDate = new Date();
        const uts = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000)
        const newDate = new Date(uts + (timeZoneOffset * 60 * 60000));

        this.setState({ currentTime: newDate });
    };

    render() {
        const { name, onDelete } = this.props;
        const { currentTime } = this.state;

        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');

        return (
            <div className="clock-container">
                <span className="clock-name">{name}</span>
                <div className="clock">
                    <button className='clock-btn-remove' onClick={onDelete}>×</button>
                    <div className="clock-main">
                        <div className="digital-clock">
                            {hours}:{minutes}:{seconds}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Clock;