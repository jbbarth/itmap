# The Server class reflects servers of your infrastructures
# We use "window.Server" here so it's made available globally.
window.Server = class Server
  constructor: (serverName, serverAttributes = {}) ->
    @name = serverName
    @attributes = serverAttributes
    #the hard way:
    #@attributes = {}
    #for key, value of serverAttributes
    #  @attributes[key] = value
