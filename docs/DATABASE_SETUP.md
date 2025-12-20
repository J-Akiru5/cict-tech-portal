# Database Setup - PlanetScale

## Why PlanetScale?

- ✅ **Free tier**: 5GB storage, 1B row reads/month
- ✅ **GitHub Education**: Extra credits available
- ✅ **MySQL compatible**: Works with Laravel out of the box
- ✅ **Database branching**: Like git for databases
- ✅ **No connection limits**: Serverless architecture

---

## Step 1: Create Account

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with **GitHub** (use your edu account)
3. Apply for GitHub Student benefits if not already done

---

## Step 2: Create Database

1. Click **Create database**
2. Name: `cict-portal`
3. Region: Choose closest (e.g., `ap-southeast-1` Singapore)
4. Plan: **Free** (Hobby)

---

## Step 3: Get Connection String

1. Click your database → **Connect**
2. Select **Laravel** from dropdown
3. Copy the connection details:

```env
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=cict-portal
DB_USERNAME=xxxxxxxxxxx
DB_PASSWORD=pscale_pw_xxxxxxxxxxxxxx
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt
```

---

## Step 4: Configure Laravel

### Update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=cict-portal
DB_USERNAME=your_username_here
DB_PASSWORD=your_password_here
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt
```

### Update `config/database.php`:

Add SSL settings to mysql connection:

```php
'mysql' => [
    'driver' => 'mysql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'unix_socket' => env('DB_SOCKET', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'prefix_indexes' => true,
    'strict' => true,
    'engine' => null,
    'options' => extension_loaded('pdo_mysql') ? array_filter([
        PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
    ]) : [],
],
```

---

## Step 5: Run Migrations

```bash
# Test connection
php artisan db:show

# Run migrations
php artisan migrate

# Seed roles
php artisan db:seed --class=RoleSeeder
```

---

## Step 6: Database Branching (Optional)

PlanetScale supports database branches like git:

```bash
# Install PlanetScale CLI
scoop install pscale  # Windows
brew install pscale   # Mac

# Login
pscale auth login

# Create development branch
pscale branch create cict-portal development

# Get connection string for dev branch
pscale connect cict-portal development --port 3309
```

---

## Alternative: Use Local MySQL for Development

If you prefer local development:

```env
# Local development
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cict_portal
DB_USERNAME=root
DB_PASSWORD=

# Production (PlanetScale)
# Switch these values in production
```

---

## Troubleshooting

### SSL Certificate Error (Windows)

If you get SSL errors on Windows, download the CA cert:

```powershell
# Download CA certificate
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "$env:USERPROFILE\.ssl\cacert.pem"
```

Then update `.env`:
```env
MYSQL_ATTR_SSL_CA=C:\Users\YourUser\.ssl\cacert.pem
```

### Connection Timeout

PlanetScale has a 30-second connection timeout. Add to `config/database.php`:

```php
'options' => [
    PDO::ATTR_TIMEOUT => 60,
],
```
