SELECT
    "Evolución"."inserted_date"                                 AS"Fecha activado",
    "Colaborador"."PPG ID"                                      AS"*PPG ID",
    "Colaborador"."Nombre(s)"                                   AS"*Nombre(s)",
    "Colaborador"."Apellido paterno"                            AS"*Apellido paterno",
    "Colaborador"."Apellido materno"                            AS"*Apellido materno",
    "Colaborador"."Sexo",
    "Colaborador"."CURP",
    "Colaborador"."Posición >Lugar"                             AS"*Lugar de trabajo (site)",
    "Colaborador"."Posición >Email"                             AS"*Email",
    "Colaborador"."Posición >Puesto >Nombre"                    AS"Puesto",
    "Colaborador"."Posición >Puesto >Nivel"                     AS"Nivel",
    "Colaborador"."Posición >Tipo"                              AS"Tipo",
    "Colaborador"."Posición >CC >COMEX ID"                      AS"Centro de costos ID",
    "Colaborador"."Posición >CC >Nombre"                        AS"Centro de costos",
    "Colaborador"."Posición >Dirección"                         AS"Dirección",
    "Colaborador"."Posición >Teléfono"                          AS"Teléfono trabajo",
    "Colaborador"."Posición >Teléfono Móvil"                    AS"Teléfono móvil",
    CONVERT(nvarchar(10),"Colaborador"."Posición >Alta",103)	AS"Fecha ingreso",
    CONVERT(nvarchar(10),"Colaborador"."Posición >Baja",103)	AS"Fecha baja",
    "Jefe"."PPG ID"                                             AS"*Jefe ID",
    "Jefe"."Nombre corto"                                       AS"*Jefe nombre",
    "Jefe"."Posición >Email"                                    AS"Jefe email",
    "Jefe"."Posición >Teléfono"                                 AS"Jefe teléfono trabajo",
    "Jefe"."Posición >Teléfono Móvil"                           AS"Jefe teléfono móvil"
FROM
    "tbl_colaboradores_view"            AS"Colaborador"
    LEFT JOIN"tbl_colaboradores_view"   AS"Jefe"ON"Jefe"."Posición"="Colaborador"."Posición >Posición jefe"
    JOIN"aut_groupmembers"              AS"Evolución"ON"Evolución"."memberempleado"="Colaborador"."Colaborador ID"AND "Evolución"."grupo"=211
ORDER BY"Evolución"."inserted_date", ("Colaborador"."Nombre(s)" + ' ' + "Colaborador"."Apellido paterno" + ISNULL(' ' + "Colaborador"."Apellido materno",''));
    