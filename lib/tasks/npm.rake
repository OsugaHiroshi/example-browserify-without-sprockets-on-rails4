namespace :npm do
  task :install do
    sh "npm install"
  end

  task :build do
    sh "npm run build:#{Rails.env}"
  end
end

# assets:precompileのafter hookでjsをbuildする
Rake::Task["assets:precompile"].enhance do
  Rake::Task['npm:install'].invoke
  Rake::Task['npm:build'].invoke
end
