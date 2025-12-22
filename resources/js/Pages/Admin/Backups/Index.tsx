import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    CircleStackIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    PlusIcon,
    FolderIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface Backup {
    filename: string;
    path: string;
    size: string;
    size_bytes: number;
    last_modified: string;
    last_modified_timestamp: number;
}

interface Stats {
    total_size: string;
    total_size_bytes: number;
    backup_count: number;
    disk: string;
    path: string;
}

interface Props {
    backups: Backup[];
    stats: Stats;
}

export default function BackupsIndex({ backups, stats }: Props) {
    const { flash } = usePage().props as any;
    const [isCreating, setIsCreating] = useState(false);
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const [backupType, setBackupType] = useState<'database' | 'full'>('database');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setIsCreating(false);
        }
        if (flash?.error) {
            toast.error(flash.error);
            setIsCreating(false);
        }
    }, [flash]);

    const createBackup = () => {
        setIsCreating(true);
        router.post(route('admin.backups.create'), {
            only_database: backupType === 'database',
        }, {
            preserveScroll: true,
        });
    };

    const downloadBackup = (filename: string) => {
        window.location.href = route('admin.backups.download', filename);
    };

    const deleteBackup = (filename: string) => {
        if (confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
            setDeletingFile(filename);
            router.delete(route('admin.backups.destroy', filename), {
                preserveScroll: true,
                onFinish: () => setDeletingFile(null),
            });
        }
    };

    const getFileIcon = (filename: string) => {
        if (filename.includes('db')) {
            return <CircleStackIcon className="h-6 w-6 text-blue-400" />;
        }
        return <FolderIcon className="h-6 w-6 text-gold-400" />;
    };

    return (
        <AdminLayout>
            <Head title="Backup Management" />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CircleStackIcon className="h-7 w-7 text-gold-400" />
                            Backup Management
                        </h1>
                        <p className="text-white/60 text-sm mt-1">Create, download, and manage system backups</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Backups */}
                    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Total Backups</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.backup_count}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                <CircleStackIcon className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Storage Used */}
                    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Storage Used</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.total_size}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                                <FolderIcon className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Disk Location */}
                    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Storage Location</p>
                                <p className="text-lg font-semibold text-white mt-1 truncate">{stats.path}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                                <FolderIcon className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Backup Section */}
                <div className="rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 border border-gold-500/20 backdrop-blur-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 text-gold-400" />
                        Create New Backup
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        {/* Backup Type Selection */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white/80 mb-2">Backup Type</label>
                            <div className="flex gap-3">
                                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                    backupType === 'database' 
                                        ? 'bg-gold-500/20 border-2 border-gold-500/50' 
                                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                                }`}>
                                    <input
                                        type="radio"
                                        name="backupType"
                                        value="database"
                                        checked={backupType === 'database'}
                                        onChange={() => setBackupType('database')}
                                        className="hidden"
                                    />
                                    <CircleStackIcon className={`h-5 w-5 ${backupType === 'database' ? 'text-gold-400' : 'text-white/40'}`} />
                                    <div>
                                        <p className={`font-medium ${backupType === 'database' ? 'text-gold-400' : 'text-white/70'}`}>Database Only</p>
                                        <p className="text-xs text-white/50">Faster, smaller file size</p>
                                    </div>
                                </label>
                                
                                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                    backupType === 'full' 
                                        ? 'bg-gold-500/20 border-2 border-gold-500/50' 
                                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                                }`}>
                                    <input
                                        type="radio"
                                        name="backupType"
                                        value="full"
                                        checked={backupType === 'full'}
                                        onChange={() => setBackupType('full')}
                                        className="hidden"
                                    />
                                    <FolderIcon className={`h-5 w-5 ${backupType === 'full' ? 'text-gold-400' : 'text-white/40'}`} />
                                    <div>
                                        <p className={`font-medium ${backupType === 'full' ? 'text-gold-400' : 'text-white/70'}`}>Full Backup</p>
                                        <p className="text-xs text-white/50">Includes files & uploads</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        {/* Create Button */}
                        <button
                            onClick={createBackup}
                            disabled={isCreating}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                    Creating Backup...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="h-5 w-5" />
                                    Create Backup
                                </>
                            )}
                        </button>
                    </div>

                    {isCreating && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                                <ArrowPathIcon className="h-5 w-5 text-blue-400 animate-spin" />
                                <div>
                                    <p className="text-blue-400 font-medium">Creating backup...</p>
                                    <p className="text-sm text-white/50">This may take a few moments. Please don't close this page.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Backups List */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FolderIcon className="h-5 w-5 text-gold-400" />
                            Backup Files
                        </h2>
                    </div>

                    {backups.length === 0 ? (
                        <div className="p-12 text-center">
                            <CircleStackIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No Backups Found</h3>
                            <p className="text-white/50 mb-6">Create your first backup using the form above.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {backups.map((backup, index) => (
                                <div 
                                    key={backup.filename}
                                    className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${
                                        index === 0 ? 'bg-green-500/5' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                            {getFileIcon(backup.filename)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white">{backup.filename}</p>
                                                {index === 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-sm text-white/50 flex items-center gap-1">
                                                    <FolderIcon className="h-3.5 w-3.5" />
                                                    {backup.size}
                                                </span>
                                                <span className="text-sm text-white/50 flex items-center gap-1">
                                                    <ClockIcon className="h-3.5 w-3.5" />
                                                    {backup.last_modified}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => downloadBackup(backup.filename)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                            title="Download"
                                        >
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            <span className="hidden sm:inline">Download</span>
                                        </button>
                                        <button
                                            onClick={() => deleteBackup(backup.filename)}
                                            disabled={deletingFile === backup.filename}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {deletingFile === backup.filename ? (
                                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <TrashIcon className="h-4 w-4" />
                                            )}
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Warning Note */}
                <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-400 font-medium">Important Notes</p>
                            <ul className="text-sm text-white/60 mt-1 list-disc list-inside space-y-1">
                                <li>Regular backups are recommended to prevent data loss.</li>
                                <li>Download and store backups in a secure, off-site location.</li>
                                <li>Old backups should be deleted periodically to save storage space.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
