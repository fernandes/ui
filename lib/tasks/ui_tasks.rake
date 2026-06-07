require "json"

namespace :ui do
  desc "Bump version (sync version.rb + package.json), rebuild JS bundle, refresh lockfiles, " \
       "stage everything for commit. Pass VERSION=x.y.z or you'll be prompted."
  task :release do
    root      = File.expand_path("../..", __dir__)
    ver_file  = File.join(root, "lib/ui/version.rb")
    pkg_file  = File.join(root, "package.json")
    current   = File.read(ver_file)[/VERSION\s*=\s*"([^"]+)"/, 1]

    target = ENV["VERSION"]
    if target.to_s.empty?
      print "Current version: #{current}\nNew version: "
      target = $stdin.gets.to_s.strip
    end

    abort "[ui:release] invalid version: #{target.inspect}" unless target.match?(/\A\d+\.\d+\.\d+(?:[-.]\w+)?\z/)
    abort "[ui:release] new version is identical to current (#{current})" if target == current

    puts "[ui:release] #{current} -> #{target}"

    # 1) lib/ui/version.rb
    new_content = File.read(ver_file).sub(/VERSION\s*=\s*"[^"]+"/, %(VERSION = "#{target}"))
    File.write(ver_file, new_content)
    puts "[ui:release] updated lib/ui/version.rb"

    # 2) package.json — preserve key order by parsing as ordered hash.
    pkg = JSON.parse(File.read(pkg_file))
    pkg["version"] = target
    File.write(pkg_file, JSON.pretty_generate(pkg) + "\n")
    puts "[ui:release] updated package.json"

    Dir.chdir(root) do
      # 3) Rollup -> app/assets/javascripts/ui.{js,esm.js}.
      # Skipping this leaves npm consumers on a stale bundle that doesn't carry
      # the latest source changes (this is exactly what bit v0.1.7).
      sh "bun run build"

      # 4) bundle install to refresh Gemfile.lock with the new version.
      sh "bundle install --quiet"

      # 5) bun install to refresh bun.lock (same workspace).
      sh "bun install"

      # 6) Stage every file that changed so the user only has to commit.
      sh "git add lib/ui/version.rb package.json " \
         "app/assets/javascripts/ui.js app/assets/javascripts/ui.esm.js " \
         "Gemfile.lock bun.lock"
    end

    puts
    puts "[ui:release] files staged. Next manual steps:"
    puts "  git commit -m 'v#{target}'"
    puts "  git tag v#{target}"
    puts "  git push origin main --tags"
    puts "  bundle exec rake release    # publish to rubygems (if configured)"
    puts "  npm publish --access public # publish to npm (if configured)"
  end
end
