USE [Reportes];
IF OBJECT_ID('dbo.tbl_colaboradores_view', 'V') IS NOT NULL DROP VIEW dbo.tbl_colaboradores_view;
GO
CREATE VIEW dbo.tbl_colaboradores_view
AS
SELECT
	"aut_domainusers"."domainuser" 							AS "PPG ID",
    
	"aut_domainusers"."posicion" 							AS "Posici�n",
	CASE
		WHEN "tbl_posiciones"."baja" IS NOT NULL AND "tbl_posiciones"."email" IS NOT NULL       THEN 'Baja con mail'
		WHEN "tbl_posiciones"."baja" IS NOT NULL                                         		THEN 'Baja'
		WHEN 
            NOT(
                "tbl_empresas"."tipoempresa" = 1
                AND "tbl_users_tiposempleado"."tipoempleado"  = 'CONFIANZA'
                AND "tbl_posiciones"."alta" <= '20170731'
                --AND "tbl_posiciones"."alta" <= DATEADD(month, -3, GETDATE())
                OR "tbl_empresas"."tipoempresa" = 7
                OR "aut_groupmembers"."memberempleado" IS NOT NULL
            ) 																					THEN 'Sin licencia'
		WHEN "tbl_posiciones"."incapacidad" IS NOT NULL 										THEN 'Incapacidad'
		--WHEN "tbl_posiciones"."email" IS NULL AND "tbl_posiciones"."equipo" IS NULL 			THEN 'Sin mail ni equipo'
		WHEN "tbl_posiciones"."email" IS NULL 													THEN 'Sin mail'
		WHEN "tbl_posiciones"."email_seguimiento" IS NULL										THEN 'Sin notificaciones'
		--WHEN "tbl_posiciones"."email_confirmed" IS NULL AND "tbl_posiciones"."equipo" IS NULL  	THEN 'Sin mail confirmado ni equipo'
		--WHEN "tbl_posiciones"."email_confirmed" IS NULL 										THEN 'Sin mail confirmado'
		--WHEN "tbl_posiciones"."equipo" IS NULL 													THEN 'Con mail y sin equipo'
																								ELSE 'Activo'
	END														AS "Posici�n >Estado",
	"tbl_posiciones"."comexid" 								AS "Posici�n >COMEX ID",
	"tbl_lugares"."lugar" 									AS "Posici�n >Lugar",
	"tbl_empresas"."empresa" 								AS "Posici�n >Lugar >Empresa",
	"tbl_empresa_tipos"."tipoempresa" 						AS "Posici�n >Lugar >Empresa >Tipo",
	"tbl_entidades"."entidad" 								AS "Posici�n >Lugar >Municipio >Entidad",
	"tbl_countries"."country"							 	AS "Posici�n >Lugar >Municipio >Entidad >Pa�s",
	"tbl_lugares"."posicion_jc"								AS "Posici�n >Lugar >Posici�n JC",
	"posicion JC"."colaborador"								AS "Posici�n >Lugar >Posici�n JC >Colaborador",
	"tbl_users_centrosdecostos"."nombre" 					AS "Posici�n >CC >Nombre",
	"tbl_users_centrosdecostos"."centrodecostoid" 			AS "Posici�n >CC >COMEX ID",
	"tbl_puestos"."nombre" 									AS "Posici�n >Puesto >Nombre",
	"tbl_puestos"."comexid" 								AS "Posici�n >Puesto >COMEX ID",
	"tbl_users_niveles"."nivel" 							AS "Posici�n >Puesto >Nivel",
	"tbl_users_tiposempleado"."tipoempleado" 				AS "Posici�n >Tipo",
	"tbl_direcciones"."direccion" 							AS "Posici�n >Direcci�n",
	"tbl_direcciones"."categoria" 							AS "Posici�n >Direcci�n >Categor�a",
	"tbl_direcciones"."posicion_BP"							AS "Posici�n >Direcci�n >Posici�n BP",
	"posicion BP"."colaborador" 							AS "Posici�n >Direcci�n >Posici�n BP >Colaborador",
	"tbl_bandas"."banda" 									AS "Posici�n >Banda",
	"tbl_posiciones"."jefe"									AS "Posici�n >Posici�n jefe",
	"posicion jefe"."colaborador"							AS "Posici�n >Posici�n jefe >Colaborador",
	"posicion director"."colaborador"						AS "Posici�n >Posici�n director >Colaborador",
	"tbl_posiciones"."email"								AS "Posici�n >Email",
	"tbl_posiciones"."email_confirmed"						AS "Posici�n >Email confirmado",
    "tbl_posiciones"."email_confirmed_date"                 AS "Posici�n >Email confirmado fecha",
	"tbl_posiciones"."email_seguimiento"					AS "Posici�n >Email seguimiento",
    "tbl_posiciones"."extension"                            AS "Posici�n >Tel�fono",
    "aut_domainusers"."movil"                               AS "Posici�n >Tel�fono m�vil",
	"tbl_posiciones"."incapacidad"							AS "Posici�n >Incapacidad",
	"tbl_posiciones"."alta"									AS "Posici�n >Alta",
	"tbl_posiciones"."baja"									AS "Posici�n >Baja",
	"tbl_posiciones"."equipo"								AS "Posici�n >Equipo",
    
	"aut_domainusers"."nombres"                             AS "Nombre(s)",
    "aut_domainusers"."apellidop"                           AS "Apellido paterno",
    "aut_domainusers"."apellidom"                           AS "Apellido materno",
    
	"aut_domainusers"."nombres" + ' ' + 
	"aut_domainusers"."apellidop" 							AS "Nombre corto",
	"aut_domainusers"."apellidop" +
	COALESCE(' ' + "aut_domainusers"."apellidom", '') + ', ' +
	"aut_domainusers"."nombres" 							AS "Nombre completo",
	"tbl_user_sexos"."sexo1C" 								AS "Sexo",
	"aut_domainusers"."curp" 								AS "CURP",
    CASE WHEN
        "tbl_posiciones"."extension"IS NULL
        AND"tbl_posiciones"."movil"IS NULL 
    THEN"aut_domainusers"."movil"END                        AS "Tel�fono m�vil",
	"aut_domainusers"."userid" 								AS "CAE ID",
	COALESCE(
		"aut_domainusers"."domainuser",
		CAST("aut_domainusers"."domainuserid" AS VARCHAR(10))
	)														AS "CAE usuario",
    COALESCE(
		"aut_domainusers"."domainuser",
		'e' + CAST("aut_domainusers"."PPGID" AS VARCHAR(10))
	)														AS "PPGUSER",
	CAST(
		CASE
			WHEN
                (
                    "tbl_empresas"."tipoempresa" = 1
                    AND "tbl_users_tiposempleado"."tipoempleado"  = 'CONFIANZA'
                    AND 
                        CASE 
                            WHEN "tbl_posiciones"."antiguedad" < "tbl_posiciones"."alta" THEN "tbl_posiciones"."antiguedad" 
                            ELSE "tbl_posiciones"."alta" 
                        END <= '20170731'
                    --AND "tbl_posiciones"."alta" <= DATEADD(month, -3, GETDATE())
                    OR "tbl_empresas"."tipoempresa" = 7
                    OR "aut_groupmembers"."memberempleado" IS NOT NULL
                    OR "evolucion"."memberempleado" IS NOT NULL
                )
                AND ("tbl_posiciones"."baja" IS NULL OR "tbl_posiciones"."email" IS NOT NULL)
			THEN 1
			ELSE 0
		END
		AS BIT
	)														AS "CAE licencia",
	
	"aut_domainusers"."PPGID" 								AS "Oracle ID",
	"aut_domainusers"."noemp" 								AS "COMEX ID",
	"aut_domainusers"."latamid" 							AS "LATAM ID",
	"aut_domainusers"."updated_date" 						AS "Fecha actualizado",
	"aut_domainusers"."inserted_date" 						AS "Fecha insertado",
	"aut_domainusers"."updated_user" 						AS "Actualizado por",
	"tbl_posiciones"."updated_date"							AS "Posici�n >Fecha actualizado",
	"tbl_posiciones"."inserted_date"						AS "Posici�n >Fecha insertado",
	
	"aut_domainusers"."domainuserid" 						AS "Colaborador ID"
FROM
	"aut_domainusers" 						
	LEFT JOIN"tbl_user_sexos" 																ON"tbl_user_sexos"."sexoid" = "aut_domainusers"."sexo"
	LEFT JOIN"aut_domainusers" 				AS "insertadopor"								ON"insertadopor"."domainuserid" = "aut_domainusers"."inserted_user"
	LEFT JOIN"aut_domainusers" 				AS "actualizadopor"								ON"actualizadopor"."domainuserid" = "aut_domainusers"."updated_user"
	
	LEFT JOIN"tbl_posiciones" 																ON"tbl_posiciones"."posicionid" = "aut_domainusers"."posicion"
	LEFT JOIN"tbl_users_tiposempleado"														ON"tbl_users_tiposempleado"."tipoempleadoid" = "tbl_posiciones"."tipo"
	LEFT JOIN"tbl_lugares" 																	ON"tbl_lugares"."lugarid" = "tbl_posiciones"."lugar"
	LEFT JOIN"tbl_empresas" 																ON"tbl_empresas"."empresaid" = "tbl_lugares"."empresa"
	LEFT JOIN"tbl_empresa_tipos"															ON"tbl_empresa_tipos"."tipoempresaid" = "tbl_empresas"."tipoempresa"
	LEFT JOIN"tbl_municipios" 																ON"tbl_municipios"."municipioid" = "tbl_lugares"."municipio"
	LEFT JOIN"tbl_entidades" 																ON"tbl_entidades"."entidadid" = "tbl_municipios"."entidad"
	LEFT JOIN"tbl_countries" 																ON"tbl_countries"."countryid" = "tbl_entidades"."country"
	LEFT JOIN"tbl_direcciones" 																ON"tbl_direcciones"."direccionid" = "tbl_posiciones"."direccion"
	LEFT JOIN"tbl_users_centrosdecostos" 													ON"tbl_users_centrosdecostos"."centrodecostoid" = "tbl_posiciones"."centrodecostos"
	LEFT JOIN"tbl_puestos" 																	ON"tbl_puestos"."puestoid" = "tbl_posiciones"."puesto"
	LEFT JOIN"tbl_users_niveles" 															ON"tbl_users_niveles"."nivelid" = "tbl_puestos"."nivel"
	LEFT JOIN"tbl_bandas" 																	ON"tbl_bandas"."bandaid" = "tbl_posiciones"."banda"
	
	LEFT JOIN"tbl_posiciones" 				AS "posicion JC"								ON"posicion JC"."posicionid" = "tbl_lugares"."posicion_jc"
	LEFT JOIN"tbl_posiciones" 				AS "posicion jefe"								ON"posicion jefe"."posicionid" = "tbl_posiciones"."jefe"
	LEFT JOIN"tbl_posiciones" 				AS "posicion director"							ON"posicion director"."posicionid" = "tbl_posiciones"."director"
	LEFT JOIN"tbl_posiciones" 				AS "posicion BP"								ON"posicion BP"."posicionid" = "tbl_direcciones"."posicion_BP"
	
	LEFT JOIN"aut_groupmembers" 															ON"aut_groupmembers"."grupo" = 6 AND "aut_groupmembers"."memberempleado" = "aut_domainusers"."domainuserid"
	LEFT JOIN"aut_groupmembers" AS "evolucion"	    										ON"evolucion"."grupo" = 211 AND "evolucion"."memberempleado" = "aut_domainusers"."domainuserid";