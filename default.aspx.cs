using System;
using System.Collections.Generic;
using NJ = Newtonsoft.Json;
using SD = System.Data;
using SDSc = System.Data.SqlClient;

public partial class SICC_v1_default : System.Web.UI.Page {
    static SICC_v1_default() {
        thistables.table(new table() {
            name = "cursos",
            update = true,
            insert = true,
            delete = true,
            dbname = "pre_cursos",
            cols = new List<col> {
                new col(){name="cursoid",select=true,insert=false,update=false,pk=true },
                new col(){name="curso",select=true,insert=false,update=false},
                new col(){name="estado",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="clave",select=true,insert=true,update=true},
                new col(){name="categoria",select=true,insert=true,update=true},
                new col(){name="objetivo",select=true,insert=true,update=true},
                new col(){name="temario",select=true,insert=true,update=true},
                new col(){name="documentoacademico",select=true,insert=true,update=true},
                new col(){name="norma",select=true,insert=true,update=true},
                new col(){name="stps_areatematica",select=true,insert=true,update=true},
                new col(){name="stps_objetivo",select=true,insert=true,update=true},
                new col(){name="(SELECT[capacitaciones]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[capacitaciones]",select=true,insert=false,update=false},
                new col(){name="(SELECT[inscripciones]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[inscripciones]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[progreso])FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[progreso]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[inicial])FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[inicial]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[final])FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[final]",select=true,insert=false,update=false},
                new col(){name="(SELECT[inicio]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[inicio]",select=true,insert=false,update=false},
                new col(){name="(SELECT[fin]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[fin]",select=true,insert=false,update=false},
                new col(){name="(SELECT[tiempoacreditado]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[tiempoacreditado]",select=true,insert=false,update=false},
                new col(){name="(SELECT[temario]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[temario]",select=true,insert=false,update=false},
                new col(){name="(SELECT[duracion]FROM[pre_cursos_view]WHERE[pre_cursos_view].[curso]=[pre_cursos].[cursoid])[duracion]",select=true,insert=false,update=false},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "cursoestados",
            insert = true,
            update = true,
            dbname = "pre_curso_estados",
            cols = new List<col> {
                new col(){name="estadoid",select=true,insert=false,update=false,pk=true },
                new col(){name="estado",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "temas",
            update = true,
            insert = true,
            delete = true,
            dbname = "pre_temas",
            cols = new List<col> {
                new col(){name="temaid",select=true,insert=false,update=false,pk=true },
                new col(){name="tema",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="instructor",select=true,insert=true,update=true},
                new col(){name="duracion",select=true,insert=true,update=true},
                new col(){name="descripcion",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "modulos",
            update = true,
            insert = true,
            delete = true,
            dbname = "pre_temarios",
            cols = new List<col> {
                new col(){name="temarioid",select=true,insert=false,update=false,pk=true },
                new col(){name="curso",select=true,insert=true,update=true},
                new col(){name="tema",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "capacitaciones",
            insert = true, update = true, delete = true,
            dbname = "pre_capacitaciones",
            cols = new List<col> {
                new col(){name="capacitacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="curso",select=true,insert=true,update=true},
                new col(){name="lugar",select=true,insert=true,update=true},
                new col(){name="coordinador",select=true,insert=true,update=true},
                new col(){name="solicitante",select=true,insert=true,update=true},
                new col(){name="progmin",select=true,insert=true,update=true},
                new col(){name="calmin",select=true,insert=true,update=true},
                new col(){name="reportestps",select=true,insert=true,update=true},
                new col(){name="(SELECT[inscripciones]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[inscripciones]",select=true,insert=false,update=false},
                new col(){name="(SELECT[estado]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[estado]",select=true,insert=false,update=false},
                new col(){name="(SELECT[progreso]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[progreso]",select=true,insert=false,update=false},
                new col(){name="(SELECT[inicial]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[inicial]",select=true,insert=false,update=false},
                new col(){name="(SELECT[final]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[final]",select=true,insert=false,update=false},
                new col(){name="(SELECT[inicio]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[inicio]",select=true,insert=false,update=false},
                new col(){name="(SELECT[fin]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[fin]",select=true,insert=false,update=false},
                new col(){name="(SELECT[tiempoacreditado]FROM[pre_capacitaciones_view]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[tiempoacreditado]",select=true,insert=false,update=false},
                new col(){name="(SELECT SUM([costo])[costo]FROM[pre_costos]WHERE[capacitacion]=[pre_capacitaciones].[capacitacionid])[costo]",select=true,insert=false,update=false},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "inscripciones",
            insert = true, update = true, delete = true,
            dbname = "pre_inscripciones",
            cols = new List<col> {
                new col(){name="inscripcionid",select=true,insert=false,update=false,pk=true },
                new col(){name="capacitacion",select=true,insert=true,update=true},
                new col(){name="alumno",select=true,insert=true,update=true},
                new col(){name="(SELECT[estado]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[estado]",select=true,insert=false,update=false},
                new col(){name="(SELECT CASE WHEN[estado]NOT IN(7,8,9,10)THEN NULLIF(CONVERT(INT,[progreso]),100)END[progreso]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[progreso]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[inicial])[inicial]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[inicial]",select=true,insert=false,update=false},
                new col(){name="(SELECT CASE WHEN[estado]NOT IN(7)THEN CONVERT(INT,[final])END[final]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[final]",select=true,insert=false,update=false},
                new col(){name="(SELECT[inicio]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[inicio]",select=true,insert=false,update=false},
                new col(){name="(SELECT[fin]FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[fin]",select=true,insert=false,update=false},
                new col(){name="(SELECT CASE WHEN[estado]NOT IN(7)THEN[tiempoacreditado]END FROM[pre_inscripciones_view]WHERE[inscripcion]=[pre_inscripciones].[inscripcionid])[tiempoacreditado]",select=true,insert=false,update=false},
                new col(){name="STPS_legal",select=true,insert=true,update=true},
                new col(){name="STPS_trabajador",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "areastematicas",
            dbname = "pre_STPS_areastematicas",
            cols = new List<col> {
                new col(){name="areatematicaid",select=true,insert=false,update=false,pk=true },
                new col(){name="areatematica",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "categorias",
            dbname = "pre_curso_categorias",
            cols = new List<col> {
                new col(){name="categoriaid",select=true,insert=false,update=false,pk=true },
                new col(){name="categoria",select=true,insert=true,update=true},
                new col(){name="descripcion",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "aut_domainusers",
            insert = true, update = true, delete = true,
            dbname = "aut_domainusers",
            cols = new List<col> {
                new col(){name="domainuserid",select=true,insert=false,update=false,pk=true },
                new col(){name="PPGID",select=true,insert=true,update=true},
                new col(){name="empleado",select=true,insert=false,update=false},
                new col(){name="apellidop",select=true,insert=true,update=true},
                new col(){name="apellidom",select=true,insert=true,update=true},
                new col(){name="nombres",select=true,insert=true,update=true},
                new col(){name="noemp",select=true,insert=true,update=true},
                new col(){name="contractorid",select=true,insert=true,update=true},
                new col(){name="latamid",select=true,insert=true,update=true},
                new col(){name="posicion",select=true,insert=true,update=true},
                new col(){name="movil",select=true,insert=true,update=true},
                new col(){name="email",select=true,insert=true,update=true},
                new col(){name="domainuser",select=true,insert=true,update=true},
                new col(){name="cumpleaños",select=true,insert=true,update=true},
                new col(){name="sexo",select=true,insert=true,update=true},
                new col(){name="curp",select=true,insert=true,update=true},
                new col(){name="curp_valid",select=true,insert=true,update=true},
                new col(){name="curp_inexistent",select=true,insert=true,update=true},
                new col(){name="rfc",select=true,insert=true,update=true},
                new col(){name="rfc_valid",select=true,insert=true,update=true},
                new col(){name="rfc_inexistent",select=true,insert=true,update=true},
                new col(){name="userid",select=true,insert=true,update=true},
                new col(){name="lastlogin_date",select=true,insert=false,update=false},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tblh_colaboradores",
            insert = false, update = false, delete = false,
            dbname = "tblh_colaboradores",
            cols = new List<col> {
                new col(){name="id",select=true,insert=false,update=false,pk=true },
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false},
                new col(){name="colaborador",select=true,insert=false,update=false },
                new col(){name="ppgid",select=true,insert=true,update=true},
                new col(){name="ppgid_c",select=true,insert=true,update=true},
                new col(){name="nombres",select=true,insert=true,update=true},
                new col(){name="nombres_c",select=true,insert=true,update=true},
                new col(){name="apellidop",select=true,insert=true,update=true},
                new col(){name="apellidop_c",select=true,insert=true,update=true},
                new col(){name="apellidom",select=true,insert=true,update=true},
                new col(){name="apellidom_c",select=true,insert=true,update=true},
                new col(){name="comexid",select=true,insert=true,update=true},
                new col(){name="comexid_c",select=true,insert=true,update=true},
                new col(){name="contractorid",select=true,insert=true,update=true},
                new col(){name="contractorid_c",select=true,insert=true,update=true},
                new col(){name="latamid",select=true,insert=true,update=true},
                new col(){name="latamid_c",select=true,insert=true,update=true},
                new col(){name="posicion",select=true,insert=true,update=true},
                new col(){name="posicion_c",select=true,insert=true,update=true},
                new col(){name="movil",select=true,insert=true,update=true},
                new col(){name="movil_c",select=true,insert=true,update=true},
                new col(){name="email",select=true,insert=true,update=true},
                new col(){name="email_c",select=true,insert=true,update=true},
                new col(){name="username",select=true,insert=true,update=true},
                new col(){name="username_c",select=true,insert=true,update=true},
                new col(){name="cumpleaños",select=true,insert=true,update=true},
                new col(){name="cumpleaños_c",select=true,insert=true,update=true},
                new col(){name="sexo",select=true,insert=true,update=true},
                new col(){name="sexo_c",select=true,insert=true,update=true},
                new col(){name="curp",select=true,insert=true,update=true},
                new col(){name="curp_c",select=true,insert=true,update=true},
                new col(){name="rfc",select=true,insert=true,update=true},
                new col(){name="rfc_c",select=true,insert=true,update=true},
                new col(){name="caeid",select=true,insert=true,update=true},
                new col(){name="caeid_c",select=true,insert=true,update=true}
            }
        });
        thistables.table(new table() {
            name = "tbl_direcciones",
            dbname = "tbl_direcciones",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="direccionid",select=true,insert=false,update=false,pk=true },
                new col(){name="direccion",select=true,insert=true,update=true},
                new col(){name="posicion_BP",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "empleadoestados",
            dbname = "tbl_users_estados",
            cols = new List<col> {
                new col(){name="estadoid",select=true,insert=false,update=false,pk=true },
                new col(){name="estado",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "centrosdecostos",
            dbname = "tbl_users_centrosdecostos",
            insert = true,
            update = true,
            cols = new List<col> {
                new col(){name="centrodecostoid",select=true,insert=true,update=false,pk=true },
                new col(){name="centrodecostos",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tbl_users_niveles",
            dbname = "tbl_users_niveles",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="nivelid",select=true,insert=false,update=false,pk=true },
                new col(){name="nivel",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "empleadotipos",
            dbname = "tbl_users_tiposempleado",
            cols = new List<col> {
                new col(){name="tipoempleadoid",select=true,insert=false,update=false,pk=true },
                new col(){name="tipoempleado",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "ocupaciones",
            dbname = "pre_STPS_ocupaciones",
            cols = new List<col> {
                new col(){name="ocupacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="ocupacion",select=true,insert=false,update=false},
                new col(){name="clave",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="area",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "nivelesacademicos",
            dbname = "pre_STPS_nivelesacademicos",
            cols = new List<col> {
                new col(){name="nivelacademicoid",select=true,insert=false,update=false,pk=true },
                new col(){name="nivelacademico",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "documentosacademicos",
            dbname = "pre_STPS_documentosacademicos",
            cols = new List<col> {
                new col(){name="documentoacademicoid",select=true,insert=false,update=false,pk=true },
                new col(){name="documentoacademico",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "cursodocumentosacademicos",
            dbname = "pre_cursos_documentosacademicos",
            cols = new List<col> {
                new col(){name="documentoacademicoid",select=true,insert=false,update=false,pk=true },
                new col(){name="documentoacademico",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "empresas",
            insert = true, update = true, delete = true,
            dbname = "tbl_empresas",
            cols = new List<col> {
                new col(){name="empresaid",select=true,insert=false,update=false,pk=true },
                new col(){name="empresa",select=true,insert=true,update=true},
                new col(){name="comexid",select=true,insert=true,update=true},
                new col(){name="razonsocial",select=true,insert=true,update=true},
                new col(){name="rfc",select=true,insert=true,update=true},
                new col(){name="establecimiento",select=true,insert=true,update=true},
                new col(){name="contacto",select=true,insert=true,update=true},
                new col(){name="tipoagente",select=true,insert=true,update=true},
                new col(){name="STPS_registro",select=true,insert=true,update=true},
                new col(){name="tipoempresa",select=true,insert=true,update=true},
                new col(){name="page",select=true,insert=true,update=true},
                new col(){name="logo",select=true,insert=false,update=false},
                new col(){name="logo_x",select=true,insert=true,update=true},
                new col(){name="logo_y",select=true,insert=true,update=true},
                new col(){name="formatoasistencias",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tbl_lugares",
            insert = true, update = true, delete = true,
            dbname = "tbl_lugares",
            cols = new List<col> {
                new col(){name="lugarid",select=true,insert=false,update=false,pk=true },
                new col(){name="comexid",select=true,insert=true,update=true},
                new col(){name="lugar",select=true,insert=true,update=true},
                new col(){name="otrosnombres",select=true,insert=true,update=true},
                new col(){name="empresa",select=true,insert=true,update=true},
                new col(){name="direccion",select=true,insert=true,update=true},
                new col(){name="telefono",select=true,insert=true,update=true},
                new col(){name="posicion_jc",select=true,insert=true,update=true},
                new col(){name="stps_claveEstablecimiento",select=true,insert=true,update=true},
                new col(){name="ip_mask",select=true,insert=true,update=true},
                new col(){name="siccid",select=true,insert=true,update=true},
                new col(){name="calle",select=true,insert=true,update=true},
                new col(){name="noexterior",select=true,insert=true,update=true},
                new col(){name="nointerior",select=true,insert=true,update=true},
                new col(){name="colonia",select=true,insert=true,update=true},
                new col(){name="cp",select=true,insert=true,update=true},
                new col(){name="municipio",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "normas",
            dbname = "pre_STPS_normas",
            cols = new List<col> {
                new col(){name="normaid",select=true,insert=false,update=false,pk=true },
                new col(){name="norma",select=true,insert=true,update=true},
                new col(){name="descripcion",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "countries",
            dbname = "tbl_countries",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="countryid",select=true,insert=false,update=false,pk=true },
                new col(){name="country",select=true,insert=true,update=true},
                new col(){name="code2",select=true,insert=true,update=true},
                new col(){name="code3",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "entidades",
            dbname = "tbl_entidades",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="entidadid",select=true,insert=false,update=false,pk=true },
                new col(){name="entidad",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="country",select=true,insert=true,update=true},
                new col(){name="abreviatura",select=true,insert=true,update=true},
                new col(){name="code2",select=true,insert=true,update=true},
                new col(){name="STPSID",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "municipios",
            dbname = "tbl_municipios",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="municipioid",select=true,insert=false,update=false,pk=true },
                new col(){name="municipio",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="entidad",select=true,insert=true,update=true},
                new col(){name="STPSID",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "objetivos",
            dbname = "pre_STPS_objetivos",
            cols = new List<col> {
                new col(){name="objetivoid",select=true,insert=false,update=false,pk=true },
                new col(){name="objetivo",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tiposagente",
            dbname = "pre_STPS_tiposagente",
            cols = new List<col> {
                new col(){name="tipoagenteid",select=true,insert=false,update=false,pk=true },
                new col(){name="tipoagente",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tbl_empresa_tipos",
            dbname = "tbl_empresa_tipos",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="tipoempresaid",select=true,insert=false,update=false,pk=true },
                new col(){name="tipoempresa",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "cuentas",
            insert = true, update = true, delete = true,
            dbname = "pre_cuentas",
            cols = new List<col> {
                new col(){name="cuentaid",select=true,insert=false,update=false,pk=true },
                new col(){name="empleado",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "permisos",
            insert = true, update = true, delete = true,
            dbname = "pre_permisos",
            cols = new List<col> {
                new col(){name="permisoid",select=true,insert=false,update=false,pk=true },
                new col(){name="cuenta",select=true,insert=true,update=true},
                new col(){name="empresa",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tbl_puestos",
            dbname = "tbl_puestos",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="puestoid",select=true,insert=false,update=false,pk=true },
                new col(){name="puesto",select=true,insert=false,update=false},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="comexid",select=true,insert=true,update=true},
                new col(){name="nivel",select=true,insert=true,update=true},
                new col(){name="ocupacion",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "estadosciviles",
            dbname = "tbl_estadosciviles",
            cols = new List<col> {
                new col(){name="estadocivilid",select=true,insert=false,update=false,pk=true },
                new col(){name="estadocivil",select=true,insert=true,update=true},
                new col(){name="STPS_estadocivil",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "discapacidades",
            dbname = "pre_STPS_discapacidades",
            cols = new List<col> {
                new col(){name="discapacidadid",select=true,insert=false,update=false,pk=true },
                new col(){name="discapacidad",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "stps_estadosciviles",
            dbname = "pre_STPS_estadosciviles",
            cols = new List<col> {
                new col(){name="estadocivilid",select=true,insert=false,update=false,pk=true },
                new col(){name="estadocivil",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "instituciones",
            dbname = "pre_STPS_institucionesacademicas",
            cols = new List<col> {
                new col(){name="institucionacademicaid",select=true,insert=false,update=false,pk=true },
                new col(){name="institucionacademica",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "sexos",
            dbname = "tbl_user_sexos",
            cols = new List<col> {
                new col(){name="sexoid",select=true,insert=false,update=false,pk=true },
                new col(){name="sexo1C",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "sesiones",
            dbname = "aut_logins",
            cols = new List<col> {
                new col(){name="loginid",select=true,insert=false,update=false,pk=true },
                new col(){name="userid",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false}
            }
        });
        thistables.table(new table() {
            name = "sesion",
            dbname = "aut_logins",
            cols = new List<col> {
                new col(){name="loginid",select=true,insert=false,update=false,pk=true }
            },
            whereparam = "[loginid]=@currentlogin"
        });
        thistables.table(new table() {
            name = "rubros",
            dbname = "pre_rubros",
            cols = new List<col> {
                new col(){name="rubroid",select=true,insert=false,update=false,pk=true },
                new col(){name="rubro",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "inscripcionestados",
            dbname = "pre_estados",
            update = true,
            cols = new List<col> {
                new col(){name="estadoid",select=true,insert=false,update=false,pk=true },
                new col(){name="estado",select=true,insert=true,update=true},
                new col(){name="descripcion",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "costos",
            dbname = "pre_costos",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="costoid",select=true,insert=false,update=false,pk=true },
                new col(){name="capacitacion",select=true,insert=true,update=true},
                new col(){name="costo",select=true,insert=true,update=true},
                new col(){name="rubro",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "formatospdf",
            dbname = "pre_formatospdf",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="formatopdfid",select=true,insert=false,update=false,pk=true },
                new col(){name="formatopdf",select=true,insert=true,update=true},
                new col(){name="formatocode",select=true,insert=true,update=true},
                new col(){name="fillcode",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "observaciones",
            dbname = "pre_observaciones",
            insert = true,
            delete = true,
            cols = new List<col> {
                new col(){name="observacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="observacion",select=true,insert=true,update=true},
                new col(){name="capacitacion",select=true,insert=true,update=true},
                new col(){name="inserted",select=true,insert=false,update=false},
                new col(){name="login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "salas",
            dbname = "pre_salas",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="salaid",select=true,insert=false,update=false,pk=true },
                new col(){name="sala",select=true,insert=false,update=false},
                new col(){name="lugar",select=true,insert=true,update=true},
                new col(){name="nombre",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "programaciones",
            dbname = "pre_programaciones",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="programacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="capacitacion",select=true,insert=true,update=true},
                new col(){name="temario",select=true,insert=true,update=true},
                new col(){name="clave",select=true,insert=true,update=true},
                new col(){name="sala",select=true,insert=true,update=true},
                new col(){name="inicio",select=true,insert=true,update=true},
                new col(){name="fin",select=true,insert=true,update=true},
                new col(){name="peso_inicial",select=true,insert=true,update=true},
                new col(){name="peso_final",select=true,insert=true,update=true},
                new col(){name="(SELECT[estado]FROM[pre_programaciones_view]WHERE[pre_programaciones_view].[programacion]=[pre_programaciones].[programacionid])[estado]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[progreso])FROM[pre_programaciones_view]WHERE[pre_programaciones_view].[programacion]=[pre_programaciones].[programacionid])[progreso]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[inicial])FROM[pre_programaciones_view]WHERE[pre_programaciones_view].[programacion]=[pre_programaciones].[programacionid])[inicial]",select=true,insert=false,update=false},
                new col(){name="(SELECT CONVERT(INT,[final])FROM[pre_programaciones_view]WHERE[pre_programaciones_view].[programacion]=[pre_programaciones].[programacionid])[final]",select=true,insert=false,update=false},
                new col(){name="(SELECT[tiempoacreditado]FROM[pre_programaciones_view]WHERE[pre_programaciones_view].[programacion]=[pre_programaciones].[programacionid])[tiempoacreditado]",select=true,insert=false,update=false},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "asistencias",
            dbname = "pre_asistencias",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="asistenciaid",select=true,insert=false,update=false,pk=true },
                new col(){name="programacion",select=true,insert=true,update=true},
                new col(){name="inscripcion",select=true,insert=true,update=true},
                new col(){name="(SELECT[estado]FROM[pre_asistencias_view]WHERE[asistencia]=[pre_asistencias].[asistenciaid])[estado]",select=true,insert=false,update=false},
                new col(){name="progreso",select=true,insert=true,update=true},
                new col(){name="inicial",select=true,insert=true,update=true},
                new col(){name="final",select=true,insert=true,update=true},
                new col(){name="(SELECT[tiempoacreditado]FROM[pre_asistencias_view]WHERE[asistencia]=[pre_asistencias].[asistenciaid])[tiempoacreditado]",select=true,insert=false,update=false},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "kpis",
            dbname = "pre_kpis",
            insert = true,
            update = true,
            delete = false,
            cols = new List<col> {
                new col(){name="kpiid",select=true,insert=false,update=false,pk=true },
                new col(){name="kpi",select=true,insert=true,update=true},
                new col(){name="descripcion",select=true,insert=true,update=true},
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "kpis2014",
            dbname = "pre_kpis_2014_view",
            insert = false,
            update = false,
            delete = false,
            cols = new List<col> {
                new col(){name="KPI",select=true,insert=false,update=false,pk=true },
                new col(){name="[alumno >lugarTrabajo >empresa]",select=true,insert=true,update=true},
                new col(){name="[alumno >direccion]",select=true,insert=true,update=true},
                new col(){name="[alumno >tipoempleado]",select=true,insert=true,update=true},
                new col(){name="[ENERO]",select=true,insert=true,update=true},
                new col(){name="[FEBRERO]",select=true,insert=true,update=true},
                new col(){name="[MARZO]",select=true,insert=true,update=true},
                new col(){name="[ABRIL]",select=true,insert=true,update=true},
                new col(){name="[MAYO]",select=true,insert=false,update=true},
                new col(){name="[JUNIO]",select=true,insert=false,update=true},
                new col(){name="[JULIO]",select=true,insert=false,update=false},
                new col(){name="[AGOSTO]",select=true,insert=true,update=false},
                new col(){name="[SEPTIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[OCTUBRE]",select=true,insert=true,update=false},
                new col(){name="[NOVIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[DICIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[2014]",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "kpis2015",
            dbname = "pre_kpis_2015_view",
            insert = false,
            update = false,
            delete = false,
            cols = new List<col> {
                new col(){name="KPI",select=true,insert=false,update=false,pk=true },
                new col(){name="[alumno >lugarTrabajo >empresa]",select=true,insert=true,update=true},
                new col(){name="[alumno >direccion]",select=true,insert=true,update=true},
                new col(){name="[alumno >tipoempleado]",select=true,insert=true,update=true},
                new col(){name="[ENERO]",select=true,insert=true,update=true},
                new col(){name="[FEBRERO]",select=true,insert=true,update=true},
                new col(){name="[MARZO]",select=true,insert=true,update=true},
                new col(){name="[ABRIL]",select=true,insert=true,update=true},
                new col(){name="[MAYO]",select=true,insert=false,update=true},
                new col(){name="[JUNIO]",select=true,insert=false,update=true},
                new col(){name="[JULIO]",select=true,insert=false,update=false},
                new col(){name="[AGOSTO]",select=true,insert=true,update=false},
                new col(){name="[SEPTIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[OCTUBRE]",select=true,insert=true,update=false},
                new col(){name="[NOVIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[DICIEMBRE]",select=true,insert=true,update=false},
                new col(){name="[2015]",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "kpiscapacitaciones",
            dbname = "[pre_kpis-capacitaciones]",
            insert = false,
            update = false,
            delete = false,
            cols = new List<col> {
                new col(){name="KPI",select=true,insert=false,update=false,pk=true },
                new col(){name="capacitacion",select=true,insert=true,update=true},
                new col(){name="[alumno >direccion]",select=true,insert=true,update=true},
                new col(){name="resultado",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "stpsareas",
            dbname = "pre_STPS_areasocupaciones",
            cols = new List<col> {
                new col(){name="areaid",select=true,insert=false,update=false,pk=true },
                new col(){name="area",select=true,insert=false,update=false },
                new col(){name="nombre",select=true,insert=true,update=true },
                new col(){name="clave",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_login",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_login",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issues",
            dbname = "pre_issues",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="issueid",select=true,insert=false,update=false,pk=true },
                new col(){name="issue",select=true,insert=false,update=false },
                new col(){name="title",select=true,insert=true,update=true },
                new col(){name="status",select=true,insert=true,update=true },
                new col(){name="detected_version",select=true,insert=true,update=true },
                new col(){name="detected_date",select=true,insert=true,update=true },
                new col(){name="done_version",select=true,insert=true,update=true },
                new col(){name="done_date",select=true,insert=true,update=true },
                new col(){name="description",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issues_status",
            dbname = "pre_issue_status",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="statusid",select=true,insert=false,update=false,pk=true },
                new col(){name="status",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issue_versions",
            dbname = "pre_issue_versions",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="versionid",select=true,insert=false,update=false,pk=true },
                new col(){name="version",select=true,insert=true,update=true },
                new col(){name="beta",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issue_suscriptions",
            dbname = "pre_issue_suscriptions",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="suscriptionid",select=true,insert=false,update=false,pk=true },
                new col(){name="issue",select=true,insert=true,update=true },
                new col(){name="usuario",select=true,insert=true,update=true },
                new col(){name="date",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issue_comments",
            dbname = "pre_issue_comments",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="commentid",select=true,insert=false,update=false,pk=true },
                new col(){name="issue",select=true,insert=true,update=true },
                new col(){name="comment",select=true,insert=true,update=true },
                new col(){name="owner",select=true,insert=true,update=true },
                new col(){name="date",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "issue_durations",
            dbname = "pre_issue_durations",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="durationid",select=true,insert=false,update=false,pk=true },
                new col(){name="issue",select=true,insert=true,update=true },
                new col(){name="start_time",select=true,insert=true,update=true },
                new col(){name="end_time",select=true,insert=true,update=true },
                new col(){name="owner",select=true,insert=true,update=true },
                new col(){name="duration",select=true,insert=true,update=true },
                new col(){name="extra",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "exceptions",
            dbname = "tbl_exceptions",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="exceptionid",select=true,insert=false,update=false,pk=true },
                new col(){name="colaborador",select=true,insert=true,update=true },
                new col(){name="solicitadopor",select=true,insert=true,update=true },
                new col(){name="motivo",select=true,insert=true,update=true },
                new col(){name="fechasolicitado",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "grupos",
            dbname = "aut_grupos",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="grupoid",select=true,insert=false,update=false,pk=true },
                new col(){name="grupo",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "groupmembers",
            dbname = "aut_groupmembers",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="groupmemberid",select=true,insert=false,update=false,pk=true },
                new col(){name="memberempleado",select=true,insert=true,update=true },
                new col(){name="grupo",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });



        thistables.table(new table() {
            name = "ppgtemas",
            dbname = "ppg_temas",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="temaid",select=true,insert=false,update=false,pk=true },
                new col(){name="tema",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "competencias",
            dbname = "ppg_competencias",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="competenciaid",select=true,insert=false,update=false,pk=true },
                new col(){name="competencia",select=true,insert=true,update=true },
                new col(){name="tema",select=true,insert=true,update=true },
                new col(){name="descripcion",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "comportamientos",
            dbname = "ppg_comportamientos",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="comportamientoid",select=true,insert=false,update=false,pk=true },
                new col(){name="comportamiento",select=true,insert=true,update=true },
                new col(){name="competencia",select=true,insert=true,update=true },
                new col(){name="descripcion",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "relaciones",
            dbname = "ppg_relaciones",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="relacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="comportamiento",select=true,insert=true,update=true },
                new col(){name="curso",select=true,insert=true,update=true },
                new col(){name="cubre100",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "cursoscae",
            dbname = "cursos LEFT JOIN[CursosDesc]ON[CursosDesc].[courseid]=[Cursos].[courseid]",
            cols = new List<col> {
                new col(){name="[Cursos].[courseid]",select=true,insert=false,update=false,pk=true },
                new col(){name="course",select=true,insert=false,update=false },
                new col(){name="category",select=true,insert=true,update=true },
                new col(){name="provider",select=true,insert=false,update=true},
                new col(){name="esDesc",select=true,insert=false,update=true}
            },
            whereparam = "[coursestatus]='EN CAT?LOGO'"
        });


        thistables.table(new table() {
            name = "software",
            dbname = "ppg_software",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="softwareid",select=true,insert=false,update=false,pk=true },
                new col(){name="software",select=true,insert=true,update=true },
                new col(){name="homepage",select=true,insert=true,update=true },
                new col(){name="justificacion",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "instalaciones",
            dbname = "ppg_instalaciones",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="instalacionid",select=true,insert=false,update=false,pk=true },
                new col(){name="software",select=true,insert=true,update=true },
                new col(){name="colaborador",select=true,insert=true,update=true },
                new col(){name="licencia",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tickets",
            dbname = "cae_tickets",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="ticketid",select=true,insert=false,update=false,pk=true },
                new col(){name="title",select=true,insert=true,update=true },
                new col(){name="caeid",select=true,insert=true,update=true },
                new col(){name="fechalevantado",select=true,insert=true,update=true },
                new col(){name="ultimocambio",select=true,insert=true,update=true },
                new col(){name="descripcion",select=true,insert=true,update=true },
                new col(){name="estadoactual",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tbl_posiciones",
            dbname = "tbl_posiciones",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="posicionid",select=true,insert=false,update=false,pk=true },
                new col(){name="comexid",select=true,insert=true,update=true },
                new col(){name="colaborador",select=true,insert=true,update=true },
                new col(){name="lugar",select=true,insert=true,update=true },
                new col(){name="puesto",select=true,insert=true,update=true },
                new col(){name="centrodecostos",select=true,insert=true,update=true },
                new col(){name="direccion",select=true,insert=true,update=true },
                new col(){name="tipo",select=true,insert=true,update=true },
                new col(){name="jefe",select=true,insert=true,update=true },
                new col(){name="director",select=true,insert=true,update=true },
                new col(){name="email",select=true,insert=true,update=true },
                new col(){name="email_inserted",select=true,insert=true,update=true },
                new col(){name="email_confirmed",select=true,insert=true,update=true },
                new col(){name="email_confirmed_date",select=true,insert=true,update=true },
                new col(){name="email_seguimiento",select=true,insert=true,update=true },
                new col(){name="extension",select=true,insert=true,update=true },
                new col(){name="movil",select=true,insert=true,update=true },
                new col(){name="banda",select=true,insert=true,update=true },
                new col(){name="equipo",select=true,insert=true,update=true },
                new col(){name="equipo_inserted",select=true,insert=true,update=true },
                new col(){name="incapacidad",select=true,insert=true,update=true },
                new col(){name="antiguedad",select=true,insert=true,update=true },
                new col(){name="alta",select=true,insert=true,update=true },
                new col(){name="baja",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "tblh_posiciones",
            dbname = "tblh_posiciones",
            insert = false, update = false, delete = false,
            cols = new List<col> {
                new col(){name="id",select=true,insert=false,update=false,pk=true },
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false},
                new col(){name="posicion",select=true,insert=false,update=false},
                new col(){name="comexid",select=true,insert=true,update=true },
                new col(){name="comexid_c",select=true,insert=true,update=true },
                new col(){name="colaborador",select=true,insert=true,update=true },
                new col(){name="colaborador_c",select=true,insert=true,update=true },
                new col(){name="lugar",select=true,insert=true,update=true },
                new col(){name="lugar_c",select=true,insert=true,update=true },
                new col(){name="puesto",select=true,insert=true,update=true },
                new col(){name="puesto_c",select=true,insert=true,update=true },
                new col(){name="centrodecostos",select=true,insert=true,update=true },
                new col(){name="centrodecostos_c",select=true,insert=true,update=true },
                new col(){name="direccion",select=true,insert=true,update=true },
                new col(){name="direccion_c",select=true,insert=true,update=true },
                new col(){name="tipo",select=true,insert=true,update=true },
                new col(){name="tipo_c",select=true,insert=true,update=true },
                new col(){name="jefe",select=true,insert=true,update=true },
                new col(){name="jefe_c",select=true,insert=true,update=true },
                new col(){name="extension",select=true,insert=true,update=true },
                new col(){name="extension_c",select=true,insert=true,update=true },
                new col(){name="movil",select=true,insert=true,update=true },
                new col(){name="movil_c",select=true,insert=true,update=true },
                new col(){name="banda",select=true,insert=true,update=true },
                new col(){name="banda_c",select=true,insert=true,update=true },
                new col(){name="alta",select=true,insert=true,update=true },
                new col(){name="alta_c",select=true,insert=true,update=true },
                new col(){name="baja",select=true,insert=true,update=true },
                new col(){name="baja_c",select=true,insert=true,update=true }
            }
        });
        thistables.table(new table() {
            name = "tbl_bandas",
            dbname = "tbl_bandas",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="bandaid",select=true,insert=false,update=false,pk=true },
                new col(){name="banda",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });
        thistables.table(new table() {
            name = "comex_enrolments",
            dbname = "inscripciones",
            insert = false, update = true, delete = false,
            cols = new List<col> {
                new col(){name="enrolmentid",select=true,insert=false,update=false,pk=true },
                new col(){name="userid",select=true,insert=false,update=false },
                new col(){name="courseid",select=true,insert=false,update=false },
                new col(){name="completion_status",select=true,insert=false,update=false },
                new col(){name="progress_measure",select=true,insert=false,update=false },
                new col(){name="pre_score",select=true,insert=false,update=false },
                new col(){name="post_score",select=true,insert=false,update=false },
                new col(){name="starttime",select=true,insert=false,update=true },
                new col(){name="endtime",select=true,insert=false,update=true },
                new col(){name="lastaccess",select=true,insert=false,update=false },
                new col(){name="requestby",select=true,insert=false,update=false },
                new col(){name="enrolments",select=true,insert=false,update=false },
                new col(){name="active",select=true,insert=false,update=false },
                new col(){name="reporttime",select=true,insert=false,update=false },
                new col(){name="creatorid",select=true,insert=false,update=true},
                new col(){name="creationtime",select=true,insert=false,update=true}
            }
        });
        thistables.table(new table() {
            name = "tbl_tfs",
            dbname = "tbl_tfs",
            insert = true, update = true, delete = true,
            cols = new List<col> {
                new col(){name="tfid",select=true,insert=true,update=true,pk=true },
                new col(){name="tf",select=true,insert=true,update=true },
                new col(){name="updated_date",select=true,insert=false,update=true},
                new col(){name="updated_user",select=true,insert=false,update=true},
                new col(){name="inserted_date",select=true,insert=false,update=false},
                new col(){name="inserted_user",select=true,insert=true,update=false}
            }
        });

        thistables.table(new table() {
            name = "now",
            cols = new List<col> {
                new col(){name="GETDATE()[now]",select=true,insert=false,update=false,pk=true }
            }
        });
    }
    protected void Page_Load(object sender, EventArgs e) {
        try {
            var a = CustomMembershipProvider.currentuserid;
        } catch (Exception) {
            Session.Abandon();
            Session.Clear();
            System.Web.Security.FormsAuthentication.SignOut();
            Response.Redirect(Request.RawUrl);
        }
    }
    //v 31/07/2014
    private static void addparameter(SDSc.SqlCommand SqlCommand, string name, List<string> row, int index, object value) {
        if (index >= 0 && (index >= row.Count || row[index] == string.Empty || row[index] == null))
            SqlCommand.Parameters.AddWithValue(string.Format("@{0}", name), DBNull.Value);
        else if (index >= 0)
            SqlCommand.Parameters.AddWithValue(string.Format("@{0}", name), row[index]);
        else
            SqlCommand.Parameters.AddWithValue(string.Format("@{0}", name), value);
    }

    [System.Web.Services.WebMethod]
    public static string getTable(string json) {
        try {
            returnval rv = json;
            var ttt = thistables.table(rv.name);
            string tmp = ttt.merge(rv);
            tmp.Replace(",null,",",a,");
            return tmp;
        } catch (Exception e) { return e.Message; }
    }

    public class returnval {
        public static implicit operator returnval(string value) {
            return (returnval)(new NJ.JsonSerializer()).Deserialize(new NJ.Linq.JTokenReader(NJ.Linq.JObject.Parse(value)), typeof(returnval));
        }
        public static implicit operator string(returnval value) {
            return Newtonsoft.Json.JsonConvert.SerializeObject(value);
        }
        public string name { get; set; }
        public int childcol { get; set; }
        public List<object[]> rows { get; set; }
        public List<returnval> childs { get; set; }
    }
    public class valss {
        public void Add(string s, object o) { cells.Add(s, o); }
        Dictionary<string, object> _cells = new Dictionary<string, object>();
		public Dictionary<string, object> cells { get { return _cells; } }
        public string cols {
            get {
                List<string> list = new List<string>();
                foreach (var item in cells)
                    list.Add(item.Key);
                return string.Format("[{0}]", string.Join("],[", list.ToArray()));
            }
        }
        public string values {
            get {
                List<string> list = new List<string>();
                foreach (var item in cells){ list.Add(item.Key); }
                return string.Format("@{0}", string.Join(",@", list.ToArray()));
            }
        }
        public string sets {
            get {
                List<string> list = new List<string>();
                foreach (var item in cells) {
                    if (item.Key == "updated_date" || item.Key.EndsWith("_UPD")) { list.Add(string.Format("[{0}]=GETDATE()", item.Key)); } 
					else { list.Add(string.Format("[{0}]=@{0}", item.Key)); }
                }
                return string.Join(",", list.ToArray());
            }
        }

        public string debug {
            get {
                List<string> list = new List<string>();
                foreach (var item in cells)
                    list.Add(string.Format("[{0}]={1}", item.Key, item.Value));
                return string.Join(",", list.ToArray());
            }
        }
        public void Parameters(SDSc.SqlCommand SqlCommand) {
            foreach (var item in cells) {
                if (item.Key == "login" || item.Key == "inserted_login" || item.Key == "updated_login") { SqlCommand.Parameters.AddWithValue(string.Format("@{0}", item.Key), CustomMembershipProvider.currentloginid); }
                else if (item.Key == "inserted_user" || item.Key == "updated_user" || item.Key.EndsWith("_UPU")) { SqlCommand.Parameters.AddWithValue(string.Format("@{0}", item.Key), CustomMembershipProvider.currentuserid); }
                else if (item.Key == "updated_date" || item.Key.EndsWith("_UPD")) { } 
				else if (item.Value == null) { SqlCommand.Parameters.AddWithValue(string.Format("@{0}", item.Key), DBNull.Value); }
                else { SqlCommand.Parameters.AddWithValue(string.Format("@{0}", item.Key), item.Value); }
            }
        }
    }

    public static tables thistables {
        get { return _thistables; }
    } static tables _thistables = new tables();

    public class tables {
        public table table(string tablename) {
            foreach (var item in list)
                if (item.name == tablename) return item;
            throw new Exception("Not found");
        }
        public table table(table tab) {
            foreach (var item in list)
                if (item == tab) return item;
                else if (item.name == tab.name)
                    throw new Exception("Name allready exist");
            list.Add(tab);
            return tab;
        }
        List<table> list { get { return _list; } } List<table> _list = new List<table>();
    }
    public class table {
        public string name { get; set; }
        public string dbname { get; set; }
        public string whereparam { get; set; }
        public string prefix { get; set; }
        public bool insert { get; set; }
        public bool update { get; set; }
        public bool delete { get; set; }
        public List<col> cols { get; set; }
        public col pk {
            get {
                foreach (col item in cols) if (item.pk) return item;
                return null;
            }
        }
        public returnval merge(returnval val, SDSc.SqlTransaction SqlTransaction) {
            valss lcols1;
            valss lcols2;
            SD.DataTable DataTable;
            SDSc.SqlCommand SqlCommand;
            if (val.rows != null) {
                for (int i = 0; i < val.rows.Count; i++) {
                    DataTable = new SD.DataTable();
                    lcols1 = new valss();
                    if (Convert.ToString(val.rows[i][0])[0] == 'D') {
                        if (!delete) throw new Exception("No delete permission");
                        val.rows[i][0] = Convert.ToInt32(Convert.ToString(val.rows[i][0]).Substring(1));
                        for (int j = 0; j < cols.Count; j++) if (cols[j].pk) lcols1.Add(cols[j].name, val.rows[i][j]); ;
                        SqlCommand = new SDSc.SqlCommand() {
                            CommandText = string.Format(
                                "DELETE FROM {0} WHERE {1};SELECT {2} FROM {0} WHERE {1};"
                                , dbname
                                , lcols1.sets
                                , selectcols
                            ),
                            Connection = SqlTransaction.Connection,
                            Transaction = SqlTransaction
                        };
                        lcols1.Parameters(SqlCommand);
                        (new SDSc.SqlDataAdapter(SqlCommand)).Fill(DataTable);
                        for (int ii = 0, length = DataTable.Columns.Count; ii < length; ii++) { val.rows[i][ii] = null; }
                    } else if (Convert.ToString(val.rows[i][0])[0] == 'I' || Convert.ToInt32(val.rows[i][0]) < 0) {
                        if (!insert) throw new Exception("No insert permission");
                        if (Convert.ToString(val.rows[i][0])[0] == 'I') {
                            val.rows[i][0] = Convert.ToInt32(Convert.ToString(val.rows[i][0]).Substring(1));
                            lcols2 = new valss();
                            for (int j = 0; j < cols.Count; j++) {
                                if (cols[j].pk) lcols2.Add(cols[j].name, val.rows[i].Length > j ? val.rows[i][j] : null);
                                if (cols[j].insert) lcols1.Add(cols[j].name, val.rows[i].Length > j ? val.rows[i][j] : null);
                            }
                            SqlCommand = new SDSc.SqlCommand() {
                                CommandText = string.Format(
                                    "INSERT INTO {0}({1})VALUES({2});SELECT {3} FROM {0} WHERE {4};"
                                    , dbname
                                    , lcols1.cols
                                    , lcols1.values
                                    , selectcols
                                    , lcols2.sets
                                ),
                                Connection = SqlTransaction.Connection,
                                Transaction = SqlTransaction
                            };
                            lcols1.Parameters(SqlCommand);
                            (new SDSc.SqlDataAdapter(SqlCommand)).Fill(DataTable);
                            val.rows[i] = DataTable.Rows[0].ItemArray;
                        } else {
                            for (int j = 0; j < cols.Count; j++) if (cols[j].insert) lcols1.Add(cols[j].name, val.rows[i].Length > j ? val.rows[i][j] : null);
                            SqlCommand = new SDSc.SqlCommand() {
                                CommandText = string.Format(
                                    "INSERT INTO {0}({1})VALUES({2});SELECT {3} FROM {0} WHERE[{4}]=@@IDENTITY;"
                                    , dbname
                                    , lcols1.cols
                                    , lcols1.values
                                    , selectcols
                                    , pk
                                ),
                                Connection = SqlTransaction.Connection,
                                Transaction = SqlTransaction
                            };
                            lcols1.Parameters(SqlCommand);
                            (new SDSc.SqlDataAdapter(SqlCommand)).Fill(DataTable);
                            if (val.childs != null) {
                                foreach (var child in val.childs) {
                                    foreach (var childrow in child.rows) {
                                        if (Convert.ToInt32(childrow[child.childcol]) == Convert.ToInt32(val.rows[i][0])) {
                                            childrow[child.childcol] = DataTable.Rows[0].ItemArray[0];
                                        }
                                    }
                                }
                            }
                            val.rows[i] = DataTable.Rows[0].ItemArray;
                        }
                    } else {
                        if (!update) throw new Exception("No update permission");
                        lcols2 = new valss();
                        for (int j = 0; j < cols.Count; j++){
                            if (cols[j].pk){ lcols2.Add(cols[j].name, val.rows[i][j]); }
                            else if (cols[j].update){ lcols1.Add(cols[j].name, val.rows[i].Length > j ? val.rows[i][j] : null); }
						}
                        SqlCommand = new SDSc.SqlCommand() {
                            CommandText = string.Format(
                                "UPDATE {0} SET {1} WHERE {2};SELECT {3} FROM {0} WHERE {2};"
                                , dbname
                                , lcols1.sets
                                , lcols2.sets
                                , selectcols
                            ),
                            Connection = SqlTransaction.Connection,
                            Transaction = SqlTransaction
                        };
                        lcols1.Parameters(SqlCommand);
                        lcols2.Parameters(SqlCommand);
                        (new SDSc.SqlDataAdapter(SqlCommand)).Fill(DataTable);
                        val.rows[i] = DataTable.Rows[0].ItemArray;
                    }
                }
            }
            return val;
        }
        public returnval merge(returnval val) {
            if (val.rows == null && val.childs == null) {
                SD.DataTable DataTable;
                using (SDSc.SqlConnection SqlConnection = new SDSc.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["reportesConnectionString"].ConnectionString)) {
                    DataTable = new SD.DataTable();
                    (new SDSc.SqlDataAdapter(new SDSc.SqlCommand() {
                        CommandText = string.Format(
                            "SELECT {0}{1}{2};"
                            , selectcols.Replace("@currentuser", CustomMembershipProvider.currentuserid.ToString())
                            , dbname == null ? "" : string.Format(" FROM {0}", dbname)
                            , whereparam == null ? "" : string.Format(" WHERE {0}", whereparam
                                .Replace("@currentuser", CustomMembershipProvider.currentuserid.ToString())
                                .Replace("@currentlogin", CustomMembershipProvider.currentloginid.ToString()))
                        ),
                        Connection = SqlConnection
                    })).Fill(DataTable);
                };
                val.rows = new List<object[]>();
                foreach (SD.DataRow DataRow in DataTable.Rows) { val.rows.Add(DataRow.ItemArray); }
            } else {
                using (SDSc.SqlConnection SqlConnection = new SDSc.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["reportesConnectionString"].ConnectionString)) {
                    SqlConnection.Open();
                    SDSc.SqlTransaction SqlTransaction = SqlConnection.BeginTransaction();
                    try {
                        merge(val, SqlTransaction);
                        if (val.childs != null) {
                            foreach (returnval subtable in val.childs) {
                                thistables.table(subtable.name).merge(subtable, SqlTransaction);
                                if (subtable.childs != null) {
                                    foreach (returnval subtable2 in subtable.childs) {
                                        thistables.table(subtable2.name).merge(subtable2, SqlTransaction);
                                    }
                                }
                            }
                        }
                        SqlTransaction.Commit();
                    } catch (Exception e) {
                        SqlTransaction.Rollback();
                        throw e;
                    }
                }
            }
            return val;
        }
        public string selectcols {
            get {
                List<string> lcolss = new List<string>();
                for (int i = 0; i < cols.Count; i++) if (cols[i].select) lcolss.Add(string.Format(" {0} ", cols[i].name));
                return string.Join(",", lcolss.ToArray());
            }
        }
        public override string ToString() {
            return name;
        }
    }
    public class col {
        public string name { get; set; }
        public bool pk { get; set; }
        public bool select { get; set; }
        public bool update { get; set; }
        public bool insert { get; set; }
        public override string ToString() {
            return name;
        }
    }
}