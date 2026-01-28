# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["controleGastos/controleGastos.csproj", "controleGastos/"]
RUN dotnet restore "controleGastos/controleGastos.csproj"

COPY . .
WORKDIR "/src/controleGastos"
RUN dotnet build "controleGastos.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "controleGastos.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "controleGastos.dll"]