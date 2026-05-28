source "https://rubygems.org"

# Use the github-pages gem to track exactly the Jekyll version and plugin set
# that GitHub Pages supports. Pin via Dependabot if/when available.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"
end

# Platform-specific gems
gem "tzinfo", ">= 1", "< 3"
gem "tzinfo-data", platforms: [:mingw, :x64_mingw, :mswin, :jruby]
gem "wdm", "~> 0.1.1", platforms: [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]

# Webrick is not in Ruby 3+ stdlib but Jekyll needs it for local serve
gem "webrick", "~> 1.8"
