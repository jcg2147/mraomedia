# Check the files exported by Jekyll, not just the rendered page templates.
root = File.expand_path("..", __dir__)
destination = File.join(root, "_site")

%w[scripts.js styles.css header2.html].each do |name|
  built_file = File.join(destination, name)
  abort "Missing required public asset: #{name}" unless File.file?(built_file)
  unless File.binread(built_file) == File.binread(File.join(root, name))
    abort "Public asset does not match its source: #{name}"
  end
end

puts "Required JavaScript, stylesheet, and navigation fragment exported correctly."
