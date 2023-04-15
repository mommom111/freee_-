import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {

  const {shiftsData} = props;

  const shiftEvents = shiftsData.map((shift) => ({
    start: new Date(shift[2]),
    end: new Date(shift[2]),
    title: shift[3] === 'morning' ? 'Morning Shift' : 'Night Shift',
  }));

  const [events, setEvents] = useState(shiftEvents);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [shiftType, setShiftType] = useState("");

  const handleSelect = ({ start }) => {
    setSelectedDate(start);
    setModalIsOpen(true);
    setShiftType(""); // 新しく選択するたびにシフトの選択をリセットする
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleShiftTypeChange = (e) => {
    setShiftType(e.target.value);
  };

  const handleShiftTypeSubmit = () => {
    const updatedEvents = events.map((event) => {
      if (moment(event.start).isSame(selectedDate, "day")) {
        return {
          ...event,
          title: shiftType,
        };
      }
      return event;
    });

    const isExistingEvent = updatedEvents.some((event) =>
      moment(event.start).isSame(selectedDate, "day")
    );

    if (isExistingEvent) {
      setEvents(updatedEvents);
    } else {
      const newEvent = {
        start: selectedDate,
        end: selectedDate,
        title: shiftType,
      };
      setEvents([...events, newEvent]);
    }

    setModalIsOpen(false);
    setSelectedDate("");
    setShiftType("");
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        selectable
        events={events}
        onSelectSlot={handleSelect}
        style={{ height: "500px" }}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        contentLabel="Shift Type Modal"
        style={{ overlay: { zIndex: 4 } }}
      >
        <div>
          <h2>シフトを選択</h2>
          <div>
            <label>
              <input
                type="radio"
                name="shiftType"
                value="Morning Shift"
                checked={shiftType === "Morning Shift"}
                onChange={handleShiftTypeChange}
              />
              朝シフト (8:00 ~ 14:00)
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="shiftType"
                value="Night Shift"
                checked={shiftType === "Night Shift"}
                onChange={handleShiftTypeChange}
              />
              夜シフト (14:00 ~ 20:00)
            </label>
          </div>
          <button onClick={handleShiftTypeSubmit}>設定</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyCalendar;