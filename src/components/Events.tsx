import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";

interface Event {
  title: string;
  time: string;
  location: string;
  description: string;
}

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverEvents, setPopoverEvents] = useState<Event[]>([]);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [popoverDate, setPopoverDate] = useState('');
  const calendarRef = useRef<HTMLDivElement>(null);

  const events = [
    {
      id: 1,
      title: "Henna Kala @Haymarket",
      date: new Date(2025, 7, 16), // August 16, 2025
      time: "10:00 AM - 12:30 PM",
      location: "Ten Thousand Villages, 140 N 8th St #125, Lincoln, NE 68508, United States.",
      capacity: "Walk-in",
      description: "Fresh and beautiful henna designs while you shop at Haymarket Farmer's Market!",
      category: "Pop-up Henna Booth"
    },
    {
      id: 2,
      title: "2025 Harvest Moon Festival",
      date: new Date(2025, 9, 5), // October 5, 2025
      time: "4:00 PM - 7:00 PM",
      location: "Antelope Park Bandshell, 1630 Memorial Dr, Lincoln, NE 68502",
      capacity: "Walk-in",
      description: "Create beautiful mandala designs inspired by traditional henna patterns.",
      category: "Public Event "
    },
  /*  {
     id: 3,
     title: "Kids Henna Fun Day",
     date: new Date(2025, 7, 29), // August 29, 2025
     time: "11:00 AM - 3:00 PM",
     location: "Garden Pavilion",
     capacity: "15 children",
     description: "Child-friendly henna designs and cultural storytelling.",
     price: "$35",
     category: "Kids Event"
    } */
  ];

  const selectedDateEvents = events.filter(event => 
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );

  const eventDates = events.map(event => event.date);

  // Calendar functionality
  const CALENDAR_EVENTS: Record<string, Event[]> = {
    "2025-08-16": [
      { title: "Haymarket Farmers Market – Henna Booth", time: "8:00 AM – 12:30 PM", location: "Haymarket Square", description: "Walk-up designs." }
    ],
    "2025-08-30": [
      { title: "Private Henna Event", time: "12:00pm – 5:00 PM", location: "Studio", description: "Event Reserved" }
    ]
  };

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const keyFor = (y: number, m: number, d: number): string => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const showPopover = (cell: HTMLElement, y: number, m: number, d: number) => {
    clearPopover();
    const list = CALENDAR_EVENTS[keyFor(y, m, d)] || [];
    const dateLabel = `${MONTHS[m]} ${d}, ${y}`;
    
    setPopoverEvents(list);
    setPopoverDate(dateLabel);

    const rect = cell.getBoundingClientRect();
    const calRect = calendarRef.current?.getBoundingClientRect();
    if (calRect) {
      setPopoverPosition({
        top: rect.bottom - calRect.top + 8,
        left: rect.left - calRect.left
      });
    }
    setPopoverVisible(true);
  };

  const clearPopover = () => {
    setPopoverVisible(false);
    setPopoverEvents([]);
  };

  const renderDayNames = () => {
    return DAY_NAMES.map(name => (
      <div key={name} className="day-name">{name}</div>
    ));
  };

  const renderCalendar = () => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    
    const firstDay = new Date(y, m, 1);
    let startDay = (firstDay.getDay() + 6) % 7; // Monday-first shift
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const cells = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="day"></div>
      );
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = keyFor(y, m, d);
      const hasEvents = CALENDAR_EVENTS[dateKey];
      
      cells.push(
        <div 
          key={d} 
          className="day"
          onMouseEnter={(e) => hasEvents && showPopover(e.currentTarget, y, m, d)}
          onMouseLeave={clearPopover}
          onTouchStart={(e) => hasEvents && showPopover(e.currentTarget, y, m, d)}
          onTouchEnd={() => setTimeout(clearPopover, 3000)} // Auto-hide after 3s on mobile
        >
          {d}
          {hasEvents && <span className="dot"></span>}
        </div>
      );
    }

    return cells;
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-subtle">
      <style>{`
        .calendar { width: 100%; max-width: 800px; margin: auto; background: hsl(var(--card)); border-radius: 18px; padding: 12px; position: relative; }
        @media (min-width: 768px) { .calendar { padding: 18px; } }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        @media (min-width: 640px) { .header { margin-bottom: 20px; flex-wrap: nowrap; } }
        .header h2 { font-size: clamp(18px, 4vw, 28px); font-weight: 700; color: hsl(var(--foreground)); margin: 0; }
        .header button { padding: 10px 14px; border-radius: 12px; border: none; cursor: pointer; background: #8d3218; color: white; font-weight: 600; transition: 0.2s; margin: 0 2px; min-height: 44px; min-width: 44px; }
        @media (min-width: 640px) { .header button { padding: 8px 12px; margin: 0 4px; } }
        .header button:hover { background: #6d2612; }
        .days { display: grid; grid-template-columns: repeat(7, 1fr); background: hsl(var(--card)); border-radius: 12px; gap: 1px; }
        @media (min-width: 640px) { .days { gap: 2px; } }
        .day-name, .day { padding: 8px 4px; border: 1px solid hsl(var(--border)); text-align: center; }
        @media (min-width: 640px) { .day-name, .day { padding: 10px; } }
        .day-name { background: hsl(var(--muted) / 0.3); font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: hsl(var(--muted-foreground)); }
        @media (min-width: 640px) { .day-name { font-size: 12px; } }
        .day { position: relative; height: 60px; cursor: pointer; background: hsl(var(--card)); color: hsl(var(--foreground)); transition: 0.2s; display: flex; align-items: flex-start; justify-content: flex-start; font-size: 14px; }
        @media (min-width: 640px) { .day { height: 80px; font-size: 16px; } }
        .day:hover, .day:active { background: hsl(var(--muted) / 0.2); transform: translateY(-1px); }
        .day .dot { width: 6px; height: 6px; background: red; border-radius: 50%; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); }
        @media (min-width: 640px) { .day .dot { bottom: 5px; } }
        .popover { position: absolute; z-index: 50; background: hsl(var(--popover)); border: 1px solid hsl(var(--border)); padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: calc(100vw - 24px); width: 280px; border-radius: 12px; color: hsl(var(--popover-foreground)); }
        @media (min-width: 640px) { .popover { max-width: 320px; width: 300px; } }
        .popover h3 { margin: 0 0 8px; font-size: 16px; color: hsl(var(--foreground)); }
        .event-item { margin-top: 5px; font-size: 0.9em; padding: 8px; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); }
        .event-item strong { color: hsl(var(--foreground)); }
      `}</style>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-seasons text-gallery-title mb-6 uppercase tracking-wide">
            Events & Workshops
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join us for immersive henna experiences, traditional art workshops, and cultural celebrations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Event Calendar Section */}
          <div className="relative">
            <h3 className="text-2xl font-seasons text-gallery-title mb-6">Event Calendar</h3>
            <div className="calendar" ref={calendarRef}>
              <div className="header">
                <button onClick={prevMonth}>Prev</button>
                <h2>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</h2>
                <button onClick={nextMonth}>Next</button>
              </div>
              <div className="days">
                {renderDayNames()}
              </div>
              <div className="days">
                {renderCalendar()}
              </div>
              
              {popoverVisible && (
                <div 
                  className="popover" 
                  style={{ 
                    top: popoverPosition.top + 'px', 
                    left: popoverPosition.left + 'px'
                  }}
                >
                  <h3>{popoverDate}</h3>
                  {popoverEvents.length ? popoverEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      <strong>{event.title}</strong><br />
                      {event.time && <>🕒 {event.time}<br /></>}
                      {event.location && <>📍 {event.location}<br /></>}
                      {event.description && <>📝 {event.description}</>}
                    </div>
                  )) : (
                    <div className="event-item">No events</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {selectedDate && selectedDateEvents.length > 0 ? (
              <>
                <h3 className="text-2xl font-seasons text-gallery-title mb-6">
                  Events on {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="bg-card/90 backdrop-blur-sm border-border/50 shadow-float hover:shadow-float-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-seasons text-gallery-title">{event.title}</h4>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          {event.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {event.description}
                      </p>
                      
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary flex-shrink-0" />
                            {event.capacity}
                          </div>
                        </div>
                      
                      <div className="flex justify-end items-center">
                        <Button variant="warm" size="lg">
                          Book Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <div>
                <h3 className="text-2xl font-seasons text-gallery-title mb-6">All Upcoming Events</h3>
                <div className="space-y-6">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-card/90 backdrop-blur-sm border-border/50 shadow-float hover:shadow-float-hover transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-seasons text-gallery-title mb-2">{event.title}</h4>
                            <p className="text-primary font-medium">
                              {event.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                            {event.category}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {event.description}
                        </p>
                        
                          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary flex-shrink-0" />
                              {event.capacity}
                            </div>
                          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <Card className="bg-event-cta p-8 text-white border-0">
            <h3 className="text-3xl font-seasons mb-4">Want to Host a Private Event?</h3>
            <p className="text-lg mb-6 opacity-90">
              Create unforgettable memories with custom henna experiences for your special occasions
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-event-cta"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us for Private Events
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Events;
