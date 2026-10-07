require "minitest/autorun"
require "jekyll"
require "json"
require "tmpdir"

class SiteTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)

  def setup
    @site = Jekyll::Site.new(Jekyll.configuration({
      "source" => ROOT, "destination" => File.join(Dir.tmpdir, "mrao-jekyll-test"),
      "quiet" => true, "disable_disk_cache" => true
    }))
    @site.reset
    @site.read
  end

  def render(source, values = {})
    Liquid::Template.parse(source).render!(
      @site.site_payload.merge(values),
      registers: { site: @site, page: {} }
    )
  end

  def test_youtube_link_formats
    id = "njiKrqDk_0E"
    links = [
      "https://www.youtube.com/watch?v=#{id}",
      "https://youtube.com/watch?feature=shared&v=#{id}&t=10",
      "https://m.youtube.com/watch?v=#{id}",
      "https://youtu.be/#{id}?si=share",
      "https://www.youtube.com/shorts/#{id}?feature=share",
      "https://www.youtube.com/embed/#{id}",
      "https://www.youtube.com/live/#{id}#fragment"
    ]
    config = YAML.safe_load_file(File.join(ROOT, "admin/config.yml"))
    field = config["collections"][0]["files"][0]["fields"][0]["fields"].find { |f| f["name"] == "youtube_url" }
    pattern = Regexp.new(field["pattern"][0])
    links.each do |url|
      assert_match pattern, url
      assert_equal id, render('{% include youtube-id.html url=url %}', { "url" => url }), url
    end
    ["https://example.com/watch?v=#{id}", "https://youtube.com/@channel", "https://youtu.be/short"].each do |url|
      refute_match pattern, url
      assert_equal "", render('{% include youtube-id.html url=url %}', { "url" => url })
    end
  end

  def test_consistent_video_frames_and_escaped_text
    video = {
      "title" => '<script>alert("title")</script>', "blurb" => "Text <b>here</b>",
      "youtube_url" => "https://youtube.com/shorts/njiKrqDk_0E",
      "roles" => ["editor", "videographer"], "orientation" => "vertical"
    }
    output = render('{% include portfolio-video.html video=video index=0 %}', { "video" => video })
    assert_includes output, "embed-responsive-16by9"
    refute_includes output, "video-vertical"
    assert_includes output, "allowfullscreen"
    assert_includes output, "editor videographer"
    assert_includes output, "&lt;script&gt;"
    refute_includes output, "<script>"
    video["orientation"] = "horizontal"
    output = render('{% include portfolio-video.html video=video %}', { "video" => video })
    assert_includes output, "embed-responsive-16by9"
    refute_includes output, "video-vertical"
  end

  def test_start_end_and_empty_times
    video = { "youtube_url" => "https://youtu.be/NLRUTUusD00", "start_seconds" => 50, "end_seconds" => 382 }
    output = render('{% include youtube-embed-url.html video=video %}', { "video" => video })
    assert_includes output, "&start=50&end=382"
    video["end_seconds"] = 20
    refute_includes render('{% include youtube-embed-url.html video=video %}', { "video" => video }), "&end="
    video.delete("start_seconds")
    video.delete("end_seconds")
    assert_equal "https://www.youtube.com/embed/NLRUTUusD00?enablejsapi=1&playsinline=1&rel=0",
      render('{% include youtube-embed-url.html video=video %}', { "video" => video })
  end

  def test_cms_fields_match_content
    config = YAML.safe_load_file(File.join(ROOT, "admin/config.yml"))
    config["collections"].each do |collection|
      collection["files"].each do |file|
        data = YAML.safe_load_file(File.join(ROOT, file["file"]))
        file["fields"].each { |field| assert data.key?(field["name"]), "Missing #{file['file']}: #{field['name']}" }
      end
    end
    videos = @site.data["portfolio"]["videos"]
    assert_kind_of Array, videos
    assert videos.all? { |video| video["youtube_url"] && video["roles"].any? }
  end

  def test_rendered_pages_and_content_edits
    @site.data["index"]["heading_1"] = "Changed heading <test>"
    @site.data["portfolio"]["videos"] = [
      { "title" => "Portrait fixture", "youtube_url" => "https://youtube.com/shorts/njiKrqDk_0E", "orientation" => "vertical", "roles" => ["editor"], "featured" => false },
      { "title" => "Featured fixture", "youtube_url" => "https://youtu.be/NLRUTUusD00", "orientation" => "horizontal", "roles" => ["producer"], "featured" => true }
    ]
    @site.generate
    @site.render
    homepage = @site.pages.find { |page| page.name == "index.html" && page.dir == "/" }.output
    portfolio = @site.pages.find { |page| page.name == "portfolio.html" }.output
    contact = @site.pages.find { |page| page.name == "contact-form2.html" }.output
    assert_includes homepage, "Changed heading &lt;test&gt;"
    assert_includes homepage, "embed-responsive-16by9"
    refute_includes homepage, "video-vertical"
    refute_includes portfolio, "video-vertical"
    assert_equal 2, portfolio.scan(/class="col-md-4 mb-4 video-card/).length
    assert_equal 1, portfolio.scan(/class="carousel-item/).length
    assert_includes contact, "mailto:#{@site.data['contact']['email']}"
    [homepage, portfolio, contact].each { |output| refute_match(/\{%|\{\{\s*site\./, output) }
  end
end
