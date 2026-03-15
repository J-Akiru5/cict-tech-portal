import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    PlusIcon,
    XMarkIcon,
    CalendarDaysIcon,
    MapPinIcon,
    ClockIcon,
    VideoCameraIcon,
    TrashIcon,
    PencilSquareIcon,
    SparklesIcon,
    PhotoIcon,
    UsersIcon,
    TicketIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface EventType {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    allDay: boolean;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: {
        type: string;
        type_label: string;
        location: string;
        is_online: boolean;
        meeting_link: string | null;
        requires_registration: boolean;
        max_attendees: number | null;
        is_featured: boolean;
        is_active: boolean;
        slug: string;
        academic_year_id: number | null;
        registration_deadline: string | null;
        cover_image: string | null;
        gallery_images: string[] | null;
    };
}

interface AcademicYear {
    id: number;
    year_start: string;
    year_end: string;
    label: string;
}

interface Props {
    events: EventType[];
    eventTypes: Record<string, string>;
    academicYears: AcademicYear[];
}

const eventTypeColors: Record<string, { bg: string; dot: string }> = {
    seminar: { bg: 'bg-gold-500/20', dot: 'bg-gold-500' },
    workshop: { bg: 'bg-blue-500/20', dot: 'bg-blue-500' },
    meeting: { bg: 'bg-purple-500/20', dot: 'bg-purple-500' },
    social: { bg: 'bg-pink-500/20', dot: 'bg-pink-500' },
    competition: { bg: 'bg-green-500/20', dot: 'bg-green-500' },
    other: { bg: 'bg-maroon-500/20', dot: 'bg-maroon-500' },
};

export default function AdminCalendar({ events, eventTypes, academicYears }: Props) {
    const { flash } = usePage().props as any;
    const calendarRef = useRef<FullCalendar>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'meeting',
        event_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        is_online: false,
        meeting_link: '',
        requires_registration: false,
        max_attendees: '',
        registration_deadline: '',
        is_featured: false,
        is_active: true,
        academic_year_id: '',
        cover_image: null as File | null,
        gallery_images: [] as File[],
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'meeting',
            event_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            location: '',
            is_online: false,
            meeting_link: '',
            requires_registration: false,
            max_attendees: '',
            registration_deadline: '',
            is_featured: false,
            is_active: true,
            academic_year_id: '',
            cover_image: null,
            gallery_images: [],
        });
        setSelectedEvent(null);
        setIsViewMode(false);
    };

    const openCreateModal = (startDate?: string, endDate?: string) => {
        resetForm();
        if (startDate) {
            setFormData(prev => ({ 
                ...prev, 
                event_date: startDate,
                end_date: endDate || startDate,
            }));
        }
        setIsModalOpen(true);
    };

    const openEditModal = (event: EventType) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            type: event.extendedProps.type,
            event_date: event.start.split('T')[0],
            end_date: event.end?.split('T')[0] || event.start.split('T')[0],
            start_time: event.start.includes('T') ? event.start.split('T')[1]?.substring(0, 5) || '' : '',
            end_time: event.end?.includes('T') ? event.end.split('T')[1]?.substring(0, 5) || '' : '',
            location: event.extendedProps.location || '',
            is_online: event.extendedProps.is_online,
            meeting_link: event.extendedProps.meeting_link || '',
            requires_registration: event.extendedProps.requires_registration,
            max_attendees: event.extendedProps.max_attendees?.toString() || '',
            registration_deadline: event.extendedProps.registration_deadline || '',
            is_featured: event.extendedProps.is_featured,
            is_active: event.extendedProps.is_active,
            academic_year_id: event.extendedProps.academic_year_id?.toString() || '',
            cover_image: null,
            gallery_images: [],
        });
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const openViewModal = (event: EventType) => {
        setSelectedEvent(event);
        setIsViewMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = {
            ...formData,
            max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
            academic_year_id: formData.academic_year_id ? parseInt(formData.academic_year_id) : null,
        };

        if (selectedEvent) {
            // For update with files, we need to use POST method spoofing
            router.post(route('admin.calendar.update', selectedEvent.id), {
                ...data,
                _method: 'put',
            }, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: (page) => {
                    setIsModalOpen(false);
                    resetForm();
                    const flash = (page.props as any).flash;
                    if (flash?.success) {
                        toast.success(flash.success);
                    }
                },
                onError: (errors) => {
                    const firstError = Object.values(errors).flat()[0] as string;
                    if (firstError?.includes('kilobytes')) {
                        toast.error('Image too large. Maximum size is 10MB.');
                    } else {
                        toast.error(firstError || 'Failed to update event.');
                    }
                },
            });
        } else {
            router.post(route('admin.calendar.store'), data, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: (page) => {
                    setIsModalOpen(false);
                    resetForm();
                    const flash = (page.props as any).flash;
                    if (flash?.success) {
                        toast.success(flash.success);
                    }
                },
                onError: (errors) => {
                    const firstError = Object.values(errors).flat()[0] as string;
                    if (firstError?.includes('kilobytes')) {
                        toast.error('Image too large. Maximum size is 10MB.');
                    } else {
                        toast.error(firstError || 'Failed to create event.');
                    }
                },
            });
        }
    };

    const handleDelete = () => {
        if (!selectedEvent) return;
        
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(route('admin.calendar.destroy', selectedEvent.id), {
                preserveScroll: true,
                onSuccess: (page) => {
                    setIsModalOpen(false);
                    resetForm();
                    const flash = (page.props as any).flash;
                    if (flash?.success) {
                        toast.success(flash.success);
                    }
                },
                onError: () => {
                    toast.error('Failed to delete event.');
                },
            });
        }
    };

    // Handle click on empty date
    const handleDateClick = (arg: { dateStr: string }) => {
        openCreateModal(arg.dateStr);
    };

    // Handle drag selection on calendar (Google Calendar style)
    const handleSelect = (arg: { startStr: string; endStr: string; allDay: boolean }) => {
        // For range selection, end date is exclusive in FullCalendar
        const endDate = new Date(arg.endStr);
        endDate.setDate(endDate.getDate() - 1);
        const adjustedEnd = arg.allDay ? endDate.toISOString().split('T')[0] : arg.endStr.split('T')[0];
        
        openCreateModal(arg.startStr.split('T')[0], adjustedEnd);
    };

    const handleEventClick = (arg: { event: any }) => {
        const eventData = events.find(e => e.id === arg.event.id);
        if (eventData) {
            openViewModal(eventData);
        }
    };

    const handleEventDrop = (arg: { event: any; revert: () => void }) => {
        const eventData = events.find(e => e.id === arg.event.id);
        if (eventData) {
            router.put(route('admin.calendar.update', eventData.id), {
                ...eventData.extendedProps,
                title: eventData.title,
                event_date: arg.event.startStr.split('T')[0],
                start_time: arg.event.startStr.includes('T') ? arg.event.startStr.split('T')[1]?.substring(0, 5) || '' : '',
                end_time: arg.event.endStr?.includes('T') ? arg.event.endStr.split('T')[1]?.substring(0, 5) || '' : '',
            }, {
                preserveScroll: true,
                onError: () => arg.revert(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Calendar Management" />
            
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CalendarDaysIcon className="h-7 w-7 text-gold-400" />
                            Event Calendar
                        </h1>
                        <p className="text-white/60 text-sm mt-1">Manage university events and activities</p>
                    </div>
                    <button
                        onClick={() => openCreateModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Event
                    </button>
                </div>

                {/* Event Type Legend */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    {Object.entries(eventTypes).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${eventTypeColors[key]?.dot || 'bg-maroon-500'}`} />
                            <span className="text-sm text-white/80">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-2xl">
                    <style>{`
                        /* FullCalendar Dark Glassmorphic Theme */
                        .fc {
                            --fc-border-color: rgba(255,255,255,0.1);
                            --fc-button-text-color: #fff;
                            --fc-button-bg-color: rgba(255,255,255,0.1);
                            --fc-button-border-color: rgba(255,255,255,0.15);
                            --fc-button-hover-bg-color: rgba(255,255,255,0.2);
                            --fc-button-hover-border-color: rgba(255,255,255,0.25);
                            --fc-button-active-bg-color: #d4a017;
                            --fc-button-active-border-color: #d4a017;
                            --fc-today-bg-color: rgba(212,160,23,0.15);
                            --fc-page-bg-color: transparent;
                            --fc-neutral-bg-color: rgba(255,255,255,0.03);
                            --fc-list-event-hover-bg-color: rgba(255,255,255,0.1);
                            --fc-highlight-color: rgba(212,160,23,0.2);
                        }
                        
                        /* Toolbar buttons */
                        .fc .fc-button {
                            font-weight: 600;
                            text-transform: capitalize;
                            border-radius: 8px !important;
                            padding: 8px 16px;
                            font-size: 0.875rem;
                        }
                        .fc .fc-button-primary:not(:disabled).fc-button-active,
                        .fc .fc-button-primary:not(:disabled):active {
                            color: #7f1d1d !important;
                            background: #d4a017 !important;
                        }
                        .fc .fc-button-group > .fc-button {
                            border-radius: 0 !important;
                        }
                        .fc .fc-button-group > .fc-button:first-child {
                            border-radius: 8px 0 0 8px !important;
                        }
                        .fc .fc-button-group > .fc-button:last-child {
                            border-radius: 0 8px 8px 0 !important;
                        }
                        
                        /* Header */
                        .fc .fc-toolbar-title {
                            color: white !important;
                            font-size: 1.5rem;
                            font-weight: 700;
                        }
                        
                        /* Column headers (days) */
                        .fc th {
                            color: rgba(255,255,255,0.9) !important;
                            font-weight: 600;
                            padding: 14px 0;
                            background: rgba(255,255,255,0.03);
                        }
                        .fc .fc-col-header-cell-cushion {
                            color: rgba(255,255,255,0.9) !important;
                        }
                        
                        /* Day numbers */
                        .fc .fc-daygrid-day-number {
                            color: rgba(255,255,255,0.85) !important;
                            padding: 10px;
                            font-weight: 500;
                        }
                        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                            color: #d4a017 !important;
                            font-weight: 700;
                        }
                        
                        /* Day cells */
                        .fc .fc-daygrid-day-frame {
                            min-height: 110px;
                        }
                        .fc .fc-daygrid-day:hover {
                            background: rgba(255,255,255,0.05);
                        }
                        .fc .fc-daygrid-day.fc-day-other .fc-daygrid-day-number {
                            color: rgba(255,255,255,0.3) !important;
                        }
                        
                        /* EVENTS - Force white text everywhere */
                        .fc .fc-event,
                        .fc .fc-event-main,
                        .fc .fc-event-title,
                        .fc .fc-event-title-container,
                        .fc .fc-event-time,
                        .fc .fc-daygrid-event,
                        .fc .fc-daygrid-block-event,
                        .fc .fc-daygrid-dot-event,
                        .fc .fc-daygrid-event .fc-event-title,
                        .fc .fc-daygrid-event .fc-event-time,
                        .fc-daygrid-dot-event .fc-event-title,
                        .fc-daygrid-block-event .fc-event-title,
                        .fc a.fc-event,
                        .fc a.fc-event:hover {
                            color: #ffffff !important;
                        }
                        .fc .fc-event {
                            cursor: pointer;
                            border-radius: 6px;
                            padding: 3px 8px;
                            font-size: 0.8rem;
                            font-weight: 500;
                            border: none !important;
                            margin-bottom: 2px;
                        }
                        .fc .fc-event-title {
                            font-weight: 600 !important;
                            color: #ffffff !important;
                        }
                        .fc .fc-daygrid-event-dot {
                            margin-right: 6px;
                            border-color: #ffffff !important;
                        }
                        
                        /* Event dot in list events */
                        .fc .fc-daygrid-dot-event .fc-event-title {
                            color: #ffffff !important;
                            font-weight: 500;
                        }
                        .fc .fc-daygrid-dot-event:hover .fc-event-title {
                            color: #ffffff !important;
                        }
                        
                        /* Selection highlight */
                        .fc .fc-highlight {
                            background: rgba(212,160,23,0.25) !important;
                            border: 2px dashed rgba(212,160,23,0.5) !important;
                        }
                        
                        /* List view */
                        .fc .fc-list-day-cushion {
                            background: rgba(127,29,29,0.4) !important;
                        }
                        .fc .fc-list-day-text, 
                        .fc .fc-list-day-side-text {
                            color: white !important;
                        }
                        .fc .fc-list-event:hover td {
                            background: rgba(255,255,255,0.1) !important;
                        }
                        .fc .fc-list-event-time,
                        .fc .fc-list-event-title,
                        .fc .fc-list-event td {
                            color: rgba(255,255,255,0.9) !important;
                        }
                        .fc .fc-list-event-graphic .fc-list-event-dot {
                            border-color: currentColor !important;
                        }
                        
                        /* Time grid view */
                        .fc .fc-timegrid-slot-label-cushion {
                            color: rgba(255,255,255,0.6) !important;
                        }
                        .fc .fc-timegrid-axis-cushion {
                            color: rgba(255,255,255,0.6) !important;
                        }
                        .fc .fc-timegrid-event,
                        .fc .fc-timegrid-event .fc-event-main,
                        .fc .fc-timegrid-event .fc-event-title,
                        .fc .fc-timegrid-event .fc-event-time {
                            color: #ffffff !important;
                        }
                        
                        /* More events link */
                        .fc .fc-daygrid-more-link {
                            color: #d4a017 !important;
                            font-weight: 600;
                        }
                    `}</style>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        events={events}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={3}
                        weekends={true}
                        dateClick={handleDateClick}
                        select={handleSelect}
                        eventClick={handleEventClick}
                        eventDrop={handleEventDrop}
                        height="auto"
                        aspectRatio={1.8}
                        unselectAuto={true}
                        selectOverlap={true}
                        longPressDelay={0}
                    />
                </div>
            </div>

            {/* Glassmorphic Event Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-900/90 to-maroon-950/95 border border-white/20 backdrop-blur-2xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <Dialog.Title className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gold-500/20 border border-gold-500/30">
                                                <CalendarDaysIcon className="h-5 w-5 text-gold-400" />
                                            </div>
                                            {isViewMode ? 'Event Details' : selectedEvent ? 'Edit Event' : 'New Event'}
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {isViewMode && selectedEvent ? (
                                        /* View Mode */
                                        <div className="space-y-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${eventTypeColors[selectedEvent.extendedProps.type]?.bg || 'bg-maroon-500/20'} text-white border border-white/10`}>
                                                        <span className={`w-2 h-2 rounded-full ${eventTypeColors[selectedEvent.extendedProps.type]?.dot || 'bg-maroon-500'}`} />
                                                        {selectedEvent.extendedProps.type_label}
                                                    </span>
                                                    {selectedEvent.extendedProps.is_featured && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gold-500 text-maroon-900">
                                                            <SparklesIcon className="h-3.5 w-3.5" /> Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-white">{selectedEvent.title}</h3>
                                            
                                            {selectedEvent.description && (
                                                <p className="text-white/70">{selectedEvent.description}</p>
                                            )}
                                            
                                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <CalendarDaysIcon className="h-5 w-5 text-gold-400" />
                                                    <span className="text-white/90">{selectedEvent.start.split('T')[0]}</span>
                                                </div>
                                                {selectedEvent.start.includes('T') && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <ClockIcon className="h-5 w-5 text-gold-400" />
                                                        <span className="text-white/90">
                                                            {selectedEvent.start.split('T')[1]?.substring(0, 5)}
                                                            {selectedEvent.end?.includes('T') && ` - ${selectedEvent.end.split('T')[1]?.substring(0, 5)}`}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedEvent.extendedProps.location && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <MapPinIcon className="h-5 w-5 text-gold-400" />
                                                        <span className="text-white/90">{selectedEvent.extendedProps.location}</span>
                                                    </div>
                                                )}
                                                {selectedEvent.extendedProps.is_online && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <VideoCameraIcon className="h-5 w-5 text-green-400" />
                                                        <span className="text-green-400">Online Event</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                                <button
                                                    onClick={() => selectedEvent && openEditModal(selectedEvent)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                    Edit Event
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Form Mode */
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Title */}
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Event Title *</label>
                                                    <input
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 focus:bg-white/15 transition-all"
                                                        placeholder="Enter event title"
                                                        required
                                                    />
                                                </div>

                                                {/* Type */}
                                                <div>
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Event Type *</label>
                                                    <div className="relative">
                                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${eventTypeColors[formData.type]?.dot || 'bg-maroon-500'}`} />
                                                        <select
                                                            value={formData.type}
                                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                            className="w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 appearance-none cursor-pointer"
                                                        >
                                                            {Object.entries(eventTypes).map(([key, label]) => (
                                                                <option key={key} value={key} className="bg-maroon-900 text-white">{label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Date *</label>
                                                    <input
                                                        type="date"
                                                        value={formData.event_date}
                                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 [color-scheme:dark]"
                                                        required
                                                    />
                                                </div>

                                                {/* Start Time */}
                                                <div>
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={formData.start_time}
                                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 [color-scheme:dark]"
                                                    />
                                                </div>

                                                {/* End Time */}
                                                <div>
                                                    <label className="block text-sm font-medium text-white/90 mb-2">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={formData.end_time}
                                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 [color-scheme:dark]"
                                                    />
                                                </div>

                                                {/* Location */}
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Location</label>
                                                    <input
                                                        type="text"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                        placeholder="e.g., CICT Auditorium"
                                                    />
                                                </div>

                                                {/* Description */}
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        rows={3}
                                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
                                                        placeholder="Add a description..."
                                                    />
                                                </div>

                                                {/* Event Media */}
                                                <div className="col-span-2 space-y-4">
                                                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Event Media</h4>
                                                    
                                                    {/* Cover Image */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-white/90 mb-2">Cover Image</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.files ? e.target.files[0] : null })}
                                                                className="block w-full text-sm text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 cursor-pointer border border-white/20 rounded-xl bg-white/5"
                                                            />
                                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                                <PhotoIcon className="h-5 w-5 text-gold-400/50" />
                                                            </div>
                                                        </div>
                                                            <p className="mt-1 text-xs text-white/40">Visible on event cards and headers. Max 10MB.</p>
                                                    </div>

                                                    {/* Gallery Images */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-white/90 mb-2">Gallery Images</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => setFormData({ ...formData, gallery_images: e.target.files ? Array.from(e.target.files) : [] })}
                                                                className="block w-full text-sm text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 cursor-pointer border border-white/20 rounded-xl bg-white/5"
                                                            />
                                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                                <PhotoIcon className="h-5 w-5 text-gold-400/50" />
                                                            </div>
                                                        </div>
                                                        <p className="mt-1 text-xs text-white/40">Photos from the event. You can select multiple.</p>
                                                    </div>
                                                </div>

                                                {/* Toggles */}
                                                <div className="col-span-2 grid grid-cols-2 gap-3">
                                                    {[
                                                        { key: 'is_online', label: 'Online Event', icon: '🌐' },
                                                        { key: 'requires_registration', label: 'Requires Registration', icon: '📝' },
                                                        { key: 'is_featured', label: 'Featured Event', icon: '⭐' },
                                                        { key: 'is_active', label: 'Active', icon: '✓' },
                                                    ].map(toggle => (
                                                        <label key={toggle.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={(formData as any)[toggle.key]}
                                                                onChange={(e) => setFormData({ ...formData, [toggle.key]: e.target.checked })}
                                                                className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0"
                                                            />
                                                            <span className="text-sm text-white/90">{toggle.icon} {toggle.label}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* Conditional Fields */}
                                                {formData.is_online && (
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-white/90 mb-2">Meeting Link</label>
                                                        <input
                                                            type="url"
                                                            value={formData.meeting_link}
                                                            onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                            placeholder="https://meet.google.com/..."
                                                        />
                                                    </div>
                                                )}

                                                {formData.requires_registration && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/90 mb-2">Max Attendees</label>
                                                            <input
                                                                type="number"
                                                                value={formData.max_attendees}
                                                                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                                min="1"
                                                                placeholder="Unlimited"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/90 mb-2">Registration Deadline</label>
                                                            <input
                                                                type="date"
                                                                value={formData.registration_deadline}
                                                                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 [color-scheme:dark]"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Form Actions */}
                                            <div className="flex gap-3 pt-5 border-t border-white/10">
                                                    {selectedEvent ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsViewMode(true)}
                                                            className="px-5 py-3 rounded-xl border border-white/20 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-colors"
                                                        >
                                                            ← Back to Details
                                                        </button>
                                                    ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsModalOpen(false)}
                                                                className="px-5 py-3 rounded-xl border border-white/20 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                    )}
                                                <button
                                                    type="submit"
                                                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25"
                                                >
                                                    {selectedEvent ? 'Update Event' : 'Create Event'}
                                                </button>
                                                {selectedEvent && (
                                                    <button
                                                        type="button"
                                                        onClick={handleDelete}
                                                        className="px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    );
}
