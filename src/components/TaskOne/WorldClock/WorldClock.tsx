import { Component } from 'react';
import Clock from '../Clock/Clock';
import './WorldClock.css';

/**
 * @interface ClockInterface
 */
interface ClockInterface {
    name: string;
    timezoneOffset: number;
}

/**
 * Интерфейс для состояния компонента WorldClock
 * @interface WorldClockState
 */
interface WorldClockState {
    clocks: ClockInterface[];
    newClockName: string;
    newClockOffset: number;
}

/**
 * @class ClockWorld - отображение часов
 * @extends {Component<WorldClockState>}
 */
class ClockWorld extends Component<{}, WorldClockState> {
    /**
     * Состояние компонента WorldClock
     * @type {WorldClockState}
     */
    state: WorldClockState = {
        clocks: [],
        newClockName: '',
        newClockOffset: 0,
    };

    /**
     * Валидность часового пояса
     * @param {number} value 
     * @returns {boolean}
     */
    ValidTimeZone(value: number): value is number { 
        return value >= -12 && value <= 12;
    }

    handleAddClock = () => {
        const { newClockName, newClockOffset } = this.state;

        if (newClockName && this.ValidTimeZone(newClockOffset)) {
            const newClock: ClockInterface = {
                name: newClockName,
                timezoneOffset: newClockOffset,
            }
            setTimeout(() => {
                this.setState((prev) => ({
                    clocks: [...prev.clocks, newClock],
                    newClockName: '',
                    newClockOffset: 0,
                }));
            }, 0);
        }
    };

    /**
     * Удаление часового пояса из списка
     * @param {number} index - Индекс удаляемого часового пояса
     */
    handleDeleteClock = (index: number) => {
        const { clocks } = this.state;
        const updatedClocks = [...clocks];
        updatedClocks.splice(index, 1);
        this.setState({ clocks: updatedClocks });
    };

    /**
     * Рендерит компонент WorldClock
     * @returns {JSX.Element} - Возвращает отрисованный компонент WorldClock
     */
    render(): JSX.Element {
        const { newClockName, newClockOffset, clocks } = this.state;
        
        return (
            <div className="container">
                <h2>Мировое время!</h2>
                <form className="clock-form" onSubmit={(e) => { e.preventDefault(); }}>
                    <input
                        type="text"
                        placeholder="Название"
                        value={newClockName}
                        onChange={(e) => this.setState({ newClockName: e.target.value || '' })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Временная зона"
                        value={newClockOffset}
                        onChange={(e) => this.setState({ newClockOffset: this.ValidTimeZone(parseInt(e.target.value)) ? parseInt(e.target.value) : 0 })}
                    />
                    <button onClick={this.handleAddClock}>Добавить</button>
                </form>
                <div className="clocks-container">
                {clocks.map((clock, index) => (
                        <Clock
                            key={index}
                            name={clock.name}
                            timeZoneOffset={clock.timezoneOffset}
                            onDelete={() => this.handleDeleteClock(index)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default ClockWorld;