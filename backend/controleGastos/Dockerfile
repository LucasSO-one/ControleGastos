# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["controleGastos.csproj", "."]
RUN dotnet restore "./controleGastos.csproj"

# Copia todo o resto da pasta atual
COPY . .
WORKDIR "/src/."
RUN dotnet build "controleGastos.csproj" -c Release -o /app/build

# Publica a aplicação
FROM build AS publish
RUN dotnet publish "controleGastos.csproj" -c Release -o /app/publish

# Estágio Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "controleGastos.dll"]