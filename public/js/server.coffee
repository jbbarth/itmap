# The Server class reflects servers of your infrastructures
# We use "window.Server" here so it's made available globally.
window.Server = class Server
  constructor: (serverName) ->
    @name = serverName
