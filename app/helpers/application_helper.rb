module ApplicationHelper

  # render script tag for javascript built on node environment
  # if no entry for 'path' in the manifest, tag should not be renderd
  def built_javascript_include_tag(path)
    manifest = Rails.application.config.assets.rev_manifest
    return '' unless manifest && manifest[path].present?

    host = Rails.application.config.action_controller.asset_host

    javascript_include_tag("#{host}/client/builds/#{manifest[path]}")
  end
end
