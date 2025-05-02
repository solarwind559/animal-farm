# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    curl \
    git \
    libonig-dev \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql mbstring exif pcntl bcmath

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app files
COPY . .

# ✅ Install Composer first
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ✅ Add Composer to path (if needed)
ENV PATH="/usr/local/bin:$PATH"

# Configure Git to allow safe directories
RUN git config --global --add safe.directory /var/www/html

# Remove problematic vendor directory & clear Composer cache **AFTER** Composer is installed
RUN rm -rf /var/www/html/vendor && composer clear-cache

# Install Composer dependencies cleanly
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress

# Set correct permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
