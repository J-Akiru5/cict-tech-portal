# DigitalOcean Spaces - Multi-Tenant Configuration

## Using Existing Spaces (SineAI Bucket)

Yes! You can absolutely use your existing SineAI Spaces bucket. We'll use folder prefixes to separate projects.

---

## Folder Structure

```
your-space-bucket/
├── sineai/               # Existing SineAI files
│   ├── uploads/
│   └── assets/
└── cict-portal/          # New CICT Portal files
    ├── images/
    ├── documents/
    ├── avatars/
    └── attachments/
```

---

## Step 1: Create New API Key (Recommended)

For better security, create a separate key:

1. Go to **DigitalOcean** → **API** → **Spaces Keys**
2. Click **Generate New Key**
3. Name: `cict-portal-key`
4. Copy both Key and Secret

---

## Step 2: Configure Laravel

### Update `.env`:

```env
# DigitalOcean Spaces Configuration
FILESYSTEM_DISK=do_spaces

DO_SPACES_KEY=your_new_spaces_key
DO_SPACES_SECRET=your_new_spaces_secret
DO_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=your-existing-bucket-name
DO_SPACES_ROOT=cict-portal
DO_SPACES_URL=https://your-bucket.sgp1.digitaloceanspaces.com/cict-portal
```

### Update `config/filesystems.php`:

```php
'disks' => [
    // ... other disks

    'do_spaces' => [
        'driver' => 's3',
        'key' => env('DO_SPACES_KEY'),
        'secret' => env('DO_SPACES_SECRET'),
        'region' => env('DO_SPACES_REGION'),
        'bucket' => env('DO_SPACES_BUCKET'),
        'endpoint' => env('DO_SPACES_ENDPOINT'),
        'root' => env('DO_SPACES_ROOT', 'cict-portal'), // Project prefix
        'url' => env('DO_SPACES_URL'),
        'visibility' => 'public',
        'throw' => true,
    ],
],
```

---

## Step 3: Usage in Code

### Upload Files

```php
use Illuminate\Support\Facades\Storage;

// Upload to cict-portal/images/
$path = Storage::disk('do_spaces')->put('images', $file);
// Result: cict-portal/images/filename.jpg

// Upload with custom name
Storage::disk('do_spaces')->putFileAs(
    'avatars', 
    $file, 
    'user-123.jpg'
);
// Result: cict-portal/avatars/user-123.jpg
```

### Get Public URL

```php
$url = Storage::disk('do_spaces')->url('images/photo.jpg');
// Result: https://your-bucket.sgp1.digitaloceanspaces.com/cict-portal/images/photo.jpg
```

### Delete Files

```php
Storage::disk('do_spaces')->delete('images/old-photo.jpg');
```

---

## Step 4: CORS Configuration

If you need direct browser uploads, configure CORS:

1. Go to **Spaces** → **Settings** → **CORS Configurations**
2. Add:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
    <CORSRule>
        <AllowedOrigin>https://your-cict-portal-domain.com</AllowedOrigin>
        <AllowedOrigin>http://localhost:8000</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
    </CORSRule>
</CORSConfiguration>
```

---

## Step 5: Optional CDN

For better performance, enable CDN:

1. Go to **Spaces** → **Settings**
2. Enable **CDN**
3. Update `.env`:

```env
DO_SPACES_URL=https://your-bucket.sgp1.cdn.digitaloceanspaces.com/cict-portal
```

---

## Testing

```bash
# Test upload via Tinker
php artisan tinker

>>> Storage::disk('do_spaces')->put('test.txt', 'Hello CICT!');
=> "test.txt"

>>> Storage::disk('do_spaces')->exists('test.txt');
=> true

>>> Storage::disk('do_spaces')->url('test.txt');
=> "https://bucket.sgp1.digitaloceanspaces.com/cict-portal/test.txt"

>>> Storage::disk('do_spaces')->delete('test.txt');
=> true
```

---

## Security Best Practices

1. **Never commit `.env`** - Already in `.gitignore`
2. **Use different keys** for each project
3. **Set file visibility** appropriately:
   - `public`: Profile pictures, announcements
   - `private`: Sensitive documents, reports
4. **Validate uploads**: Check file types and sizes

```php
$request->validate([
    'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
]);
```
