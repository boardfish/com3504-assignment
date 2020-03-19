require 'json'


MyApp.add_route('POST', '/stories', {
  "resourcePath" => "/Stories",
  "summary" => "Create a story",
  "nickname" => "add_story", 
  "responseClass" => "Story",
  "endpoint" => "/stories", 
  "notes" => "",
  "parameters" => [
    {
      "name" => "body",
      "description" => "story object for listing",
      "dataType" => "Story",
      "paramType" => "body",
    }
    ]}) do
  cross_origin
  # the guts live here

  { storyId: 0, userId: 0, text: 'string', likes: [] }.to_json
end


MyApp.add_route('GET', '/stories', {
  "resourcePath" => "/Stories",
  "summary" => "Get all stories",
  "nickname" => "get_stories", 
  "responseClass" => "Array<Story>",
  "endpoint" => "/stories", 
  "notes" => "Returns all stories",
  "parameters" => [
    ]}) do
  cross_origin
  # the guts live here

  [{ storyId: 0, userId: 0, text: 'string', likes: [{ storyId: 0, userId: 1}]}].to_json
end


MyApp.add_route('GET', '/stories/{storyId}', {
  "resourcePath" => "/Stories",
  "summary" => "Find story by ID",
  "nickname" => "get_story_by_id", 
  "responseClass" => "Story",
  "endpoint" => "/stories/{storyId}", 
  "notes" => "Returns a single story",
  "parameters" => [
    {
      "name" => "story_id",
      "description" => "ID of story to return",
      "dataType" => "Integer",
      "paramType" => "path",
    },
    ]}) do
  cross_origin
  # the guts live here

  { storyId: 0, userId: 0, text: 'string', likes: [] }.to_json
end


MyApp.add_route('GET', '/users/{userId}/stories', {
  "resourcePath" => "/Stories",
  "summary" => "Find a user's stories",
  "nickname" => "get_user_stories", 
  "responseClass" => "Array<Story>",
  "endpoint" => "/users/{userId}/stories", 
  "notes" => "Returns stories a user has created",
  "parameters" => [
    {
      "name" => "user_id",
      "description" => "ID of user whose stories should be returned",
      "dataType" => "Integer",
      "paramType" => "path",
    },
    ]}) do
  cross_origin
  # the guts live here

  [{ storyId: 0, userId: 0, text: 'string', likes: [] }].to_json
end


MyApp.add_route('POST', '/stories/{storyId}/rate/{vote}', {
  "resourcePath" => "/Stories",
  "summary" => "Like a story",
  "nickname" => "like_story", 
  "responseClass" => "void",
  "endpoint" => "/stories/{storyId}/rate/{vote}", 
  "notes" => "Creates a like for a story",
  "parameters" => [
    {
      "name" => "story_id",
      "description" => "ID of story to like",
      "dataType" => "Integer",
      "paramType" => "path",
    },
    {
      "name" => "vote",
      "description" => "Rating to give to story",
      "dataType" => "Integer",
      "paramType" => "path",
    },
    ]}) do
  cross_origin
  # the guts live here

  ''.to_json
end

