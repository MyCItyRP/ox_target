local QBCore = exports['qb-core']:GetCoreObject()
local playerData = {job = {}, gang = {}}
local utils = require 'client.utils'

Citizen.CreateThread(function()
    if LocalPlayer.state.isLoggedIn then
        playerData = QBCore.Functions.GetPlayerData()
    end
end)

AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    playerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent('QBCore:Client:OnGangUpdate')
AddEventHandler('QBCore:Client:OnGangUpdate', function(gang)
    playerData.gang = gang
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate')
AddEventHandler('QBCore:Client:OnJobUpdate', function(job)
    playerData.job = job
end)

---@diagnostic disable-next-line: duplicate-set-field
function utils.hasPlayerGotGroup(filter)
    local _type = type(filter)

    if _type == 'string' then
        local job = playerData.job.name == filter
        local gang = playerData.gang.name == filter
        local citizenId = playerData.citizenid == filter

        if job or gang or citizenId then
            return true
        end
    elseif _type == 'table' then
        local tabletype = table.type(filter)

        if tabletype == 'hash' then
            for name, grade in pairs(filter) do
                local job = playerData.job.name == name
                local gang = playerData.gang.name == name
                local citizenId = playerData.citizenid == name

                if job and grade <= playerData.job.grade.level or gang and grade <= playerData.gang.grade.level or citizenId then
                    return true
                end
            end
        elseif tabletype == 'array' then
            for i = 1, #filter do
                local name = filter[i]
                local job = playerData.job.name == name
                local gang = playerData.gang.name == name
                local citizenId = playerData.citizenid == name

                if job or gang or citizenId then
                    return true
                end
            end
        end
    end
end
