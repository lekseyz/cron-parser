import React, { useState } from "react";
import "./App.css";

const App = () => {
  // Переключатели
  const [everyMonth, setEveryMonth] = useState(false);
  const [everyDayOfMonth, setEveryDayOfMonth] = useState(false); 
  const [everyDayOfWeek, setEveryDayOfWeek] = useState(false);
  const [everyMinute, setEveryMinute] = useState(false);


  const [selectedMonths, setSelectedMonths] = useState([]); // Выбранные месяцы
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]); // Выбранные дни недели
  const [dayOfMonth, setDayOfMonth] = useState(""); // Введенный день месяца
  const [time, setTime] = useState(""); // Введенное время
  const [delayTime, setDelay] = useState(""); // Введенное время задержки
  const [cronRes, setResult] = useState(""); // Значение textbox с crontab

  // Save
  function statesToCron() {
    var cron = "";

    if (!everyMinute && time) {
      const [hours, minutes] = time.split(":").map((str) => parseInt(str));
      cron += minutes + " " + hours + " ";
    }
    else {
      const [hoursDelay, minutesDelay] = delayTime ? delayTime.split(":").map((str) => parseInt(str)) : [1, 1];
      cron += "*" + (minutesDelay > 1 ? "/" + minutesDelay + " " : " ");
      cron += "*" + (hoursDelay > 1 ? "/" + hoursDelay + " " : " ");
      
    }

    if (!everyDayOfMonth && dayOfMonth) {
      cron += dayOfMonth + " ";
    }
    else {
      cron += "* ";
    }

    if (!everyMonth && selectedMonths.length > 0) {
      cron += selectedMonths.join(",") + " ";
    }
    else {
      cron += "* ";
    }

    if (!everyDayOfWeek && selectedDaysOfWeek.length > 0) {
      cron += selectedDaysOfWeek.join(",") + " ";
    }
    else {
      cron += "* ";
    }

    if (!testCronInput(cron)) 
      alert("internal parsing error");

    setResult(cron);
  }

  // Load
  function cronToStates() {
    if (!testCronInput(cronRes)) {
      alert("wrong corn syntax");
      return;
    }

    const [minute, hour, day, month, weekday] = cronRes.split(/\s+/);
    var timedelay = "", time = "";

    if (minute.startsWith("*") !== hour.startsWith("*")) {
      alert("unsuported cron syntax");
      return;
    }
    
    if (minute.startsWith("*")) {
      setEveryMinute(true);
      timedelay = /([^\*\/]+)$/.test(minute) ? ('0' + minute.match(/([^\*\/]+)$/)[0]).slice(-2) : "00";

    }
    else {
      setEveryMinute(false);
      time = ('0' + minute).slice(-2);
    }

    if (hour.startsWith("*")) {
      setEveryMinute(true);
      timedelay = (/([^\*\/]+)$/.test(hour) ? ('0' + hour.match(/([^\*\/]+)$/)[0]).slice(-2) : "00") + ":" + (timedelay ? timedelay : "00");
    }
    else {
      setEveryMinute(false);
      time = hour + ":" + ('0' + time).slice(-2) ? time : "00";
    }

    setTime(time);
    setDelay(timedelay);
    
    if (day === "*") {
      setEveryDayOfMonth(true);
    }
    else {
      setEveryDayOfMonth(false);
      setDayOfMonth(parseInt(day));
    }

    if (!month.includes("*")) {
      setSelectedMonths(month.split(","));
      setEveryMonth(false);
    }
    else {
      setEveryMonth(true);
    }

    if (!weekday.includes("*")) {
      setSelectedDaysOfWeek(weekday.split(","));
      setEveryDayOfWeek(false);
    }
    else {
      setEveryDayOfWeek(true);
    }
  }

  
  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  
  const daysOfWeek = [
    "Понедельник", "Вторник", "Среда", 
    "Четверг", "Пятница", "Суббота", "Воскресенье"
  ];

  const handleMonthChange = (event) => {
    const value = event.target.value;
    const valueId = months.indexOf(value) + 1;
    setSelectedMonths((prev) =>
      prev.includes(valueId) ? prev.filter((monthId) => monthId !== valueId) : [...prev, valueId]
    );
  };

  const handleDayOfWeekChange = (event) => {
    const value = event.target.value;
    const valueId = daysOfWeek.indexOf(value) + 1;
    setSelectedDaysOfWeek((prev) =>
      prev.includes(valueId) ? prev.filter((dayId) => dayId !== valueId) : [...prev, valueId]
    );
  };

  const handleDayOfMonthChange = (event) => {
    const value = event.target.value;
    if (/^(3[01]|[12][0-9]|[1-9])?$/.test(value)) {
      setDayOfMonth(value);
    }
  };

  function testCronInput(value) {
    return /^\s*(\*(\/[1-5][0-9]|\/[1-9])?|[1-5][0-9]|[1-9])\s+(\*(\/2[0-4]|\/1[0-9]|\/[1-9])?|2[0-4]|1[1-9]|[1-9])\s+(\*|3[01]|[12][0-9]|[1-9])\s+(\*|(1[0-2]|[1-9])(,1[0-2]|,[1-9])*)\s+(\*|[0-7](,[0-7])*)\s*$/.test(value) //Прошу прощения. Просто захотел поупражнятся в регулярках
  }

  return (
    <div className="container">
      {/* Переключатель "каждый месяц" для месяцев */}
      <div className="App">
      <div>
          <input
            type="checkbox"
            checked={everyMonth}
            onChange={() => setEveryMonth(!everyMonth)}
          />
        <label>
          Каждый месяц
        </label>
      </div>

      {/* Дропдаун для выбора месяцев */}
      {!everyMonth && (
        <div>
          <label>Выберите месяцы:</label>
          <select multiple value={selectedMonths.map(id => months[id - 1])} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}

      <br />

      {/* Переключатель "каждый день" для дня месяца */}
      <div>
          <input
            type="checkbox"
            checked={everyDayOfMonth}
            onChange={() => setEveryDayOfMonth(!everyDayOfMonth)}
          />
        <label>
         Каждый день месяца
        </label>
      </div>

      {/* Текстбокс для ввода дня месяца */}
      {!everyDayOfMonth && (
        <div>
          <label>Введите день месяца (от 1 до 31):</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={handleDayOfMonthChange}
          />
        </div>
      )}

      <br />

      {/*Переключатель "каждый день недели" */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={everyDayOfWeek}
            onChange={() => setEveryDayOfWeek(!everyDayOfWeek)}
          />
          Каждый день недели
        </label>
      </div>

      {/* Дропдаун для выбора дней недели */}
      {!everyDayOfWeek && (<div>
        <label>Выберите дни недели:</label>
        <select
          multiple
          value={selectedDaysOfWeek.map(id => daysOfWeek[id - 1])}
          onChange={handleDayOfWeekChange}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>)}

      <br/>

      {/* Переключатель */}
      <div>
        <label>
          <input
          type="checkbox"
          checked={everyMinute}
          onChange={() => setEveryMinute(!everyMinute)}
          />
          Повторять через
        </label>
      </div>


      {everyMinute && (<div>
          <label>
            <input
            type="time"
            value={delayTime}
            onChange={(e) => setDelay(e.target.value)}
            />
            минут
          </label>
            
      </div>)}  

      {/* Строка для ввода времени */}
      {!everyMinute && (<div>
        <label>Введите время:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>)}

      <button 
      name="save" 
      onClick={(e) => console.log(statesToCron())} 
      >save</button>

      <button 
      name="load"  
      onClick={(e) => cronToStates()} 
      >load</button>

      <br/>
      <input 
        type="text"
        value={cronRes}
        onChange={(e) => setResult(e.target.value)}
      />
      </div>
    </div>
  );
};

export default App;
