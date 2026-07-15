# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# Copy only the project file first to cache NuGet restores (faster subsequent builds)
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the source code and build it
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# 2. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Render exposes and routes traffic via port 8080 by default
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ZenLogWEBAPI.dll"]