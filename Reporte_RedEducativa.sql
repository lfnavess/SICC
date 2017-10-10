USE [Reportes];
IF OBJECT_ID('dbo.Reporte_RedEducativa', 'V') IS NOT NULL DROP VIEW dbo.Reporte_RedEducativa;
GO
CREATE VIEW dbo.Reporte_RedEducativa
AS 
SELECT
	"inscripcion"."reporttime"			 																			AS "Fecha corte",
	CASE
		WHEN "alumno"."Posici�n >Incapacidad" IS NOT NULL AND "inscripcion"."completion_status" IN(6,7,8,9,10)	THEN 'Incapacidad'
		ELSE "estado"."completionstatus"
	END 																											AS "Estado",
	"alumno"."PPG ID"                                                                                       		AS "Alumno >PPG ID",
	"alumno"."Nombre corto"																							AS "Alumno >Nombre corto",
	"cursos"."coursename"																							AS "Curso >Nombre",
	CASE
		WHEN "alumno"."Posici�n" IS NULL OR "alumno"."Posici�n >Baja" IS NOT NULL						THEN 'Alumno baja'
		WHEN "inscripcion"."active" = 0																	THEN 'Inscripci�n eliminada'
		WHEN "inscripcion"."courseid" NOT IN(3754, 3770) AND "alumnoSN"."groupmemberid" IS NOT NULL		THEN 'Inscripci�n sin notificaciones'
		WHEN "cursos"."active" = 0																		THEN 'Curso descontinuado'
		WHEN "alumno"."CAE licencia" = 0																THEN 'Alumno sin licencia'
		WHEN "alumno"."Posici�n >Incapacidad" IS NOT NULL												THEN 'Alumno incapacidad'
		WHEN "alumno"."Posici�n >Email" IS NULL 														THEN 'Alumno sin mail'
		WHEN "alumno"."Posici�n >Email seguimiento" IS NULL												THEN 'Alumno sin notificaciones'
		--WHEN "alumno"."Posici�n >Email confirmado" IS NULL												THEN 'Alumno sin mail confirmado'
	END 																											AS "Estado2",
    CAST("inscripcion"."progress_measure" * 100 AS INT)                                                             AS "Progreso",
	"inscripcion"."pre_score"																						AS "Nota inicial",
	"inscripcion"."post_score" 																						AS "Nota final",
	CAST("inscripcion"."starttime" AS DATE)			 																AS "Fecha inicio",
	CAST("inscripcion"."endtime" AS DATE)																			AS "Fecha fin",
	"inscripcion"."lastaccess"			 																			AS "�ltimo progreso",
	"enrolments" 																									AS "Inscripciones",
	CASE
		WHEN "inscripcion"."progress_measure" > 0 AND "cursos"."duration" IS NOT NULL THEN
			RIGHT('0' + CAST(DATEDIFF(hour, 0, DATEADD(minute, DATEDIFF(minute, 0, "cursos"."duration") * "inscripcion"."progress_measure", 0)) AS VARCHAR(3)), 2) + ':' +
			RIGHT('0' + CAST(DATEPART(minute, DATEADD(minute, DATEDIFF(minute, 0, "cursos"."duration") * "inscripcion"."progress_measure", 0)) AS VARCHAR(2)), 2)
	END 																											AS "Tiempo acreditado",

	"solicitante"."PPG ID"									    			        	AS "Solicitante >PPG ID",
	"solicitante"."Nombre corto" 														AS "Solicitante >Nombre corto",
	"solicitante"."Posici�n >Email" 													AS "Solicitante >Email",
	
	"alumno"."Colaborador ID" 															AS "Alumno ID",
	"alumno"."Sexo" 																	AS "Alumno >Sexo",
	"alumno"."Posici�n >Estado" 														AS "Alumno >Estado",
	"alumno"."Posici�n >Email" 															AS "Alumno >Email",
	"alumno"."Posici�n >Tel�fono" 														AS "Alumno >Tel�fono",
	"alumno"."Posici�n >Tel�fono M�vil" 												AS "Alumno >Tel�fono M�vil",
	"alumno"."Posici�n >Lugar" 															AS "Alumno >Lugar",
	"alumno"."Posici�n >Lugar >Empresa" 												AS "Alumno >Lugar >Empresa",
	"alumno"."Posici�n >Lugar >Empresa >Tipo"											AS "Alumno >Lugar >Empresa >Tipo",
	"alumno"."Posici�n >Lugar >Municipio >Entidad" 										AS "Alumno >Lugar >Municipio >Entidad",
	"alumno"."Posici�n >Lugar >Municipio >Entidad >Pa�s" 								AS "Alumno >Lugar >Municipio >Entidad >Pa�s",
	"PJC"."PPG ID" 							        									AS "Alumno >Lugar >Jefe capacitaci�n >PPG ID",
	"PJC"."Nombre corto" 																AS "Alumno >Lugar >Jefe capacitaci�n >Nombre corto",
	"PJC"."Posici�n >Email" 															AS "Alumno >Lugar >Jefe capacitaci�n >Email",
	"alumno"."Posici�n >Tipo" 															AS "Alumno >Tipo",
	"alumno"."Posici�n >CC >Nombre" 													AS "Alumno >Centro de costos >Nombre",
	"alumno"."Posici�n >CC >COMEX ID" 													AS "Alumno >Centro de costos >COMEX ID",
	"alumno"."Posici�n >Puesto >Nombre" 												AS "Alumno >Puesto >Nombre",
	"alumno"."Posici�n >Puesto >Nivel" 													AS "Alumno >Puesto >Nivel",
	"alumno"."Posici�n >Banda"															AS "Alumno >Banda",
	"alumno"."Posici�n >Direcci�n" 														AS "Alumno >Direcci�n",
	"alumno"."Posici�n >Direcci�n >Categor�a"											AS "Alumno >Direcci�n >Categor�a",
	"PBP"."PPG ID" 		        														AS "Alumno >Direcci�n >Business Partner >PPG ID",
	"PBP"."Nombre corto" 																AS "Alumno >Direcci�n >Business Partner >Nombre corto",
	"PBP"."Posici�n >Email" 															AS "Alumno >Direcci�n >Business Partner >Email",
	"PJ"."PPG ID"			 															AS "Alumno >Jefe >PPG ID",
	"PJ"."Nombre corto" 																AS "Alumno >Jefe >Nombre corto",
	"PJ"."Posici�n >Email" 																AS "Alumno >Jefe >Email",
	"PJ"."Posici�n >Lugar >Empresa" 										    		AS "Alumno >Jefe >Lugar >Empresa",
	"PJ"."Posici�n >Lugar >Empresa >Tipo"						    					AS "Alumno >Jefe >Lugar >Empresa >Tipo",
	"PJ"."Posici�n >Puesto >Nivel" 				    									AS "Alumno >Jefe >Puesto >Nivel",
	"PJ"."Sexo" 																        AS "Alumno >Jefe >Sexo",
	"PD"."Nombre corto" 																AS "Alumno >Director >Nombre corto",
	
	"inscripcion"."courseid"															AS "Curso ID",
	"cursos"."coursestatus"																AS "Curso >Estado",
	"cursos"."provider" 																AS "Curso >Proveedor",
	"cursos"."category" 																AS "Curso >Categor�a",
	"cursos"."releasetime" 																AS "Curso >Liberado",
	"cursos"."activities" 																AS "Curso >Lecciones",
	RIGHT('0' + CAST(DATEDIFF(hour, 0, "cursos"."duration") AS VARCHAR(3)), 2) + ':' +
	RIGHT('0' + CAST(DATEPART(minute, "cursos"."duration") AS VARCHAR(2)), 2)        	AS "Curso >Duraci�n",
	CASE
		WHEN "alumno"."Posici�n >Incapacidad" IS NOT NULL AND "inscripcion"."completion_status" IN(6,7,8,9,10)	THEN 5
		ELSE "inscripcion"."completion_status"
	END 																				AS "Estado orden",
	"inscripcion"."completion_status"													AS "Estado ID",
	YEAR(
		CASE
			WHEN "inscripcion"."completion_status" = 1 			THEN "inscripcion"."lastaccess"
			WHEN YEAR("inscripcion"."endtime") = YEAR(GETDATE()) 	THEN "inscripcion"."endtime"
			WHEN "inscripcion"."lastaccess" IS NOT NULL 			THEN "inscripcion"."lastaccess"
			ELSE "inscripcion"."starttime"
		END
	) 																					AS "Capacitaci�n a�o",
	CASE WHEN"inscripcion"."progress_measure"=1 THEN 100 ELSE 0 END						AS "Completado", 
	COALESCE("creator"."Nombre corto", CAST("inscripcion"."creatorid" AS NVARCHAR(10)))	AS "Creado por >Nombre corto",
	"inscripcion"."creationtime"			 											AS "Fecha creado",
	"inscripcion"."enrolmentid" 														AS "Inscripci�n ID"
FROM
	"inscripciones" 							AS "inscripcion"
	LEFT JOIN"cursos" 							        			ON"cursos"."id" 										= "inscripcion"."courseid"
	LEFT JOIN"tbl_colaboradores_view" 			AS "alumno"			ON"alumno"."CAE ID" 									= "inscripcion"."userid"
	LEFT JOIN"aut_groupmembers" 				AS "alumnoSN"		ON"alumnoSN"."memberempleado" 							= "alumno"."Colaborador ID" AND "grupo" = 111
	LEFT JOIN"tbl_colaboradores_view" 			AS "PJC"			ON"PJC"."Colaborador ID" 								= "alumno"."Posici�n >Lugar >Posici�n JC >Colaborador"
	LEFT JOIN"tbl_colaboradores_view" 			AS "PJ"				ON"PJ"."Colaborador ID" 								= "alumno"."Posici�n >Posici�n jefe >Colaborador"
	LEFT JOIN"tbl_colaboradores_view" 			AS "PD"				ON"PD"."Colaborador ID" 								= "alumno"."Posici�n >Posici�n director >Colaborador"
	LEFT JOIN"tbl_colaboradores_view" 			AS "PBP"			ON"PBP"."Colaborador ID"								= "alumno"."Posici�n >Direcci�n >Posici�n BP >Colaborador"
	LEFT JOIN"tbl_colaboradores_view" 			AS "solicitante"	ON"solicitante"."CAE ID" 								= "inscripcion"."requestby"
	LEFT JOIN"tbl_colaboradores_view" 			AS "creator"		ON"creator"."CAE ID" 									= "inscripcion"."creatorid"
	LEFT JOIN"inscripciones_completion_status" 	AS "estado"			ON"estado"."completionstatusid" 						= "inscripcion"."completion_status";