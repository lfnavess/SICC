/// <reference path="../scripts/jquery/jquery.js" />
/// <reference path="../scripts/moment/moment.js" />
/// <reference path="../scripts/jsPDF/jspdf.min.js" />
/// <reference path="../scripts/jsPDF/jspdf.plugin.addimage.js" />
/// <reference path="../scripts/jsPDF/jspdf.plugin.standard_fonts_metrics.js" />
/// <reference path="../scripts/comex-3.00B/comex.js" />
try {
    $(function () {
        "use strict";
        jsPDF.API.spaceChars = function (text, x, y, spacing) {
            var jsPDF = this;
            for (var i = 0, length = text.length ; i < length; i++, x += spacing) { jsPDF.text(text[i], x, y); }
            return jsPDF;
        };

        var database = IDatabase();
        //Capacitaciones
        database.tables({
            title: ['Capacitaciones', 'Capacitación', 'capacitaciones'],
            insert: true, update: true, delete: true,
            colsdef: ['Capacitación ID', 'Inscripciones', 'Curso', "Estado", "Asistencia", 'Calificación final', 'Fecha inicio', 'Fecha fin', "Horas hombre"
                , 'Solicitante', 'Lugar', 'Coordinador', 'Se reporta a la STPS', 'Calificación inicial', 'Costo', 'Curso >Categoría', 'Curso >Duración'
                , "Sesión insertado >Colaborador"],
            orderdef: [['Capacitación ID', true]],
            cols: [
                { title: 'Capacitación ID', identity: true, str: true },
                {
                    title: 'Curso', type: "Int", required: true, openform: true, onChange: function (curso, capacitacion) {
                        if (capacitacion.action() === "INSERT" && curso.isVal()) {
                            var modulos = curso.val().relations("Modulos|Curso");
                            var programaciones = capacitacion.relations("Programaciones|Capacitación");
                            var calificacionMinima = capacitacion.cell("Calificación mínima");
                            for (var i = 0, programacion; i < modulos.length; i++) {
                                programacion = programaciones.new();
                                programacion.cell("Modulo").val(modulos[i]);
                                programacion.cell("Con calificación inicial").change("disabled", !calificacionMinima.isVal());
                                programacion.cell("Con calificación final").change("disabled", !calificacionMinima.isVal()).val(calificacionMinima.isVal());
                            }
                        }
                    }, colsdef: ["Capacitación ID", "Inscripciones", "Estado", "Asistencia", "Calificación inicial", "Calificación final", "Fecha inicio", "Fecha fin"
                        , "Horas hombre", "Solicitante", 'Lugar', "Coordinador", "Asistencia mínima", "Calificación mínima", "Se reporta a la STPS", "Costo"]
                },
                { title: 'Lugar', type: "Int", required: true, explicacion: "Lugar que coordina, solo que este campo es mas fijo por si el coordinador se mueve de área." },
                { title: 'Coordinador', type: "Int", required: true },
                { title: 'Solicitante', type: "Int", required: true, explicacion: "Es la persona cuyo Centro de costos sale pago al proveedor, si es interno o no hay costo es la persona que necesita se de la capacitación" },
                {
                    title: 'Asistencia mínima', type: 'Int', min: 50, max: 100, step: 5, required: true, default: 80
                    , onchange: function (asistenciaminima, capacitacion) {
                        var asistencias = capacitacion.relations(database.tables("Inscripciones").cols("Capacitación"))
                            .relations(database.tables("Asistencias").cols("Inscripción"));
                        for (var i = 0; i < length; i++) { estado(asistencias[i]); }
                    }, explicacion: "Para determinar estado NO COMPLETADO/COMPLETADO (50-100) según la asistencia"
                },
                {
                    title: 'Calificación mínima', type: 'Int', min: 50, max: 100, step: 5, onChange: function (calificacion_minima, capacitacion) {
                        var programaciones = capacitacion.relations(database.tables("Programaciones").cols("Capacitación"));
                        if (calificacion_minima._ori && !calificacion_minima.isVal() && programaciones.find(function (programacion) { return programacion.cell("Calificación final").isVal(); })) {
                            //calificacion_minima.val(calificacion_minima._ori);
                            //alert("Antes de poder modificar este valor es necesario eliminar Calificación final en programaciones");
                        } else {
                            for (var i = 0; i < programaciones.length; i++) {
                                programaciones[i].cell("Con calificación inicial").change("disabled", !calificacion_minima.isVal());
                                programaciones[i].cell("Con calificación final").change("disabled", !calificacion_minima.isVal());
                                if (programaciones[i].action() === "INSERT") { programaciones[i].cell("Con calificación final").val(calificacion_minima.isVal()); }
                            }
                        }
                    }, explicacion: "Para determinar estado REPROBADO/APROBADO (50-100) según calificación final, dejalo en blanco si no hay evaluación"
                },
                { title: 'Se reporta a la STPS', type: "Bool" },
                { title: 'Inscripciones', type: "Int", readonly: true },
                { title: 'Estado', type: "Int", readonly: true },
                { title: 'Asistencia', type: "Int", readonly: true },
                { title: 'Calificación inicial', type: "Int", readonly: true },
                { title: 'Calificación final', type: "Int", readonly: true },
                { title: 'Fecha inicio', type: 'Datetime', readonly: true, },
                { title: 'Fecha fin', type: 'Datetime', readonly: true },
                { title: 'Horas hombre', type: 'Duration', readonly: true },
                { title: 'Costo', type: "Currency", readonly: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }],
            contextMenu: { "DC-3": { name: "Formato DC-3", callback: menu_dc3 } }
        });
        //function aa() {
        //    try {
        //        var capacitacion, rowformato;
        //        capacitacion = this.data("row");
        //        //rowformato = database.tables('Formatos PDF').rows(1);
        //        //var formato = rowformato.cell('Código relleno').val();
        //        dc3(capacitacion, this.closest("form"));
        //        //$('<form>').prop('title', rowformato)
        //        //    .append($('<iframe style="width:100%;height:100%;margin-bottom: -7px;margin-right: -4px;">')
        //        //        .prop('src', rowformato.cell('Código relleno').code(capacitacion).output('datauristring')))
        //        //    .dialog({
        //        //        width: "1000px",
        //        //        modal: true,
        //        //        height: 900
        //        //    });
        //    } catch (e) { alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(e.message)); }
        //}
        function menu_dc3() {
            var capacitacion = this.data("row"), proveedores, curso, alumnos, inscripciones, empresas, puestos, reqInscripciones = [];
            var parent = this.closest("form");
            validate_curso();
            function validate_curso() {
                curso = capacitacion.cell("Curso").val();
                curso.cell("STPS Área temática").change("required", true);
                if (curso.isValid()) { validate_proveedor(); } else { curso.form(validate_proveedor, parent, false, "Validar curso"); }
            }
            function validate_proveedor() {
                proveedores = curso.relations("Modulos|Curso").cell("Tema >Instructor >Lugar >Empresa");
                for (var i = 0; i < proveedores.length; i++) { proveedores[i].cell("Razón social").change("required", true); }
                if (proveedores.isValid()) { validate_capacitacion(); } else { proveedores.formsear(validate_capacitacion, parent, "table-edit"); }
            }
            function validate_capacitacion() {
                capacitacion.cell("Se reporta a la STPS").change("required", true);
                if (capacitacion.isValid()) { validate_inscripciones(); } else { capacitacion.form(validate_inscripciones, parent, false, "Validar capacitación"); }
            }
            function validate_inscripciones() {
                inscripciones = capacitacion.relations("Inscripciones|Capacitación").sortCols("Alumno").where(function (inscripcion) {
                    return [1, 2].contains(inscripcion.cell("Estado").val().val());
                }, true, reqInscripciones);
                for (var i = 0; i < inscripciones.length; i++) {
                    inscripciones[i].cell("Representante legal").change("required", true);
                    inscripciones[i].cell("Representante trabajador").change("required", true);
                }
                if (inscripciones.isValid()) { validate_alumnos(); } else { inscripciones.formsear(validate_alumnos, parent, "subtable", "Validar inscripciones"); }
            }
            function validate_alumnos() {
                alumnos = inscripciones.cell("Alumno");
                for (var i = 0; i < alumnos.length; i++) {
                    alumnos[i].cell("Puesto").change("required", true);
                    alumnos[i].cell("CURP").change("required", true);
                }
                if (alumnos.isValid()) { validate_empresas(); } else { alumnos.formsear(validate_empresas, parent, "table-edit", "Validar alumnos"); }
            }
            function validate_empresas() {
                empresas = alumnos.cell("Lugar >Empresa");
                for (var i = 0; i < empresas.length; i++) {
                    empresas[i].cell("Razón social").change("required", true);
                    empresas[i].cell("RFC").change("required", true);
                }
                if (empresas.isValid()) { validate_puestos(); } else { empresas.formsear(validate_puestos, parent, "table-edit", "Validar empresas"); }
            }
            function validate_puestos() {
                puestos = alumnos.cell("Puesto");
                for (var i = 0; i < puestos.length; i++) { puestos[i].cell("STPS Ocupación").change("required", true); }
                if (puestos.isValid()) { trabajar_formatos(); } else { puestos.formsear(trabajar_formatos, parent, "table-edit", "Validar puestos"); }
            }
            function trabajar_formatos() {
                var doc, texttmp;
                //inscripciones = inscripciones
                //    .where(function (inscripcion) {
                //        return ![1, 2].contains(inscripcion.cell("Capacitación ID.Curso.Proveedor.STPS Agente capacitador").val(undefined, "VAL")) ||
                //            inscripcion.cell("Capacitación ID.Curso.Proveedor.STPS Registro").isVal();
                //    }, true, reqProveedorRegistro)

                //if (reqAsistencia.length > 0) {
                //    alert("No es posible imprimir {0} formatos, no pasan el campo \"%Asistencia mínima\":\r{1}.".format(
                //        reqAsistencia.length,
                //        reqAsistencia.join("\r")));
                //}
                //if (reqArpobar.length > 0) {
                //    alert("No es posible imprimir {0} formatos, no pasan el campo \"Calificación mínima\":\r{1}.".format(
                //        reqArpobar.length,
                //        reqArpobar.join("\r")));
                //}
                //if (inscripciones.length === 0) { throw new Error("Hay 0 formatos que pasaron los requerimientos mínimos."); }
                for (var i = 0, inscripcion; i < inscripciones.length; i++) {
                    inscripcion = inscripciones[i];
                    if (i) { doc.addPage(); } else { doc = new jsPDF(undefined, undefined, "letter"); }
                    doc.setFont("courier").setFontType("normal").setTextColor(0).setFontSize(10);
                    doc.text("Inscripción: {0} Capacitación: {1} NoEmp: {2}".format(
                            inscripcion.val()
                            , inscripcion.cell("Capacitación")
                            , inscripcion.cell("Alumno >COMEX ID")
                        ), 9, 49);
                    //if (inscripcion.cell("Alumno >Lugar >Empresa >Logo").isVal()) {
                    //    doc.addImage(
                    //        inscripcion.cell("Alumno >Lugar >Empresa >Logo").val(),
                    //        "JPEG",
                    //        inscripcion.cell("Alumno >Lugar >Empresa >LogoX").val(),
                    //        inscripcion.cell("Alumno >Lugar >Empresa >LogoY").val());
                    //}
                    doc.text("{0} {1}, {2}".format(
                        inscripcion.cell("Alumno >Apellido paterno"),
                        inscripcion.cell("Alumno >Apellido materno"),
                        inscripcion.cell("Alumno >Nombre(s)")
                    ), 9, 68);
                    texttmp = inscripcion.cell("Alumno >CURP").val(undefined, "TEXT");
                    doc.spaceChars(texttmp.slice(0, 13), 11.2, 77.5, 5.0)
                        .spaceChars(texttmp.slice(13, 14), 77.6, 77.5, 5.0)
                        .spaceChars(texttmp.slice(14), 84, 77.5, 5.0);
                    texttmp = "{0}|{1}".format(inscripcion.cell("Alumno >Puesto >STPS Ocupación >Clave"), inscripcion.cell("Alumno >Puesto >STPS Ocupación >Nombre"));
                    texttmp = texttmp.length > 46 ? "{0}…".format(texttmp.slice(0, 45)) : texttmp;
                    doc.text(texttmp, 106, 77.5);
                    doc.text(inscripcion.cell("Alumno >Puesto").val(undefined, "TEXT"), 9, 86.5);
                    doc.text(inscripcion.cell("Alumno >Lugar >Empresa >Razón social").val(undefined, "TEXT"), 9, 108);
                    texttmp = inscripcion.cell("Alumno >Lugar >Empresa >RFC").val(undefined, "TEXT");
                    doc.spaceChars(texttmp.slice(0, 3), 16.2, 117.6, 5).spaceChars(texttmp.slice(3, 9), 36.4, 117.6, 5).text(texttmp.slice(9, 10), 71.4, 117.6)
                        .text(texttmp.slice(10, 11), 77.6, 117.6).text(texttmp.slice(11, 12), 83.8, 117.6);
                    doc.text(inscripcion.cell("Capacitación >Curso").val(undefined, "TEXT"), 9, 136);
                    doc.text(Math.round(inscripcion.cell("Capacitación >Curso >Duración").val().asHours()).toString(), 9, 145)
                        .spaceChars(inscripcion.cell("Capacitación >Fecha inicio").val().format("YYYY"), 89.3, 145, 5.6)
                        .spaceChars(inscripcion.cell("Capacitación >Fecha inicio").val().format("MMDD"), 112.5, 145, 7.2)
                        .spaceChars(inscripcion.cell("Capacitación >Fecha fin").val().format("YYYY"), 150, 145, 6.6)
                        .spaceChars(inscripcion.cell("Capacitación >Fecha fin").val().format("MMDD"), 178, 145, 7);
                    doc.text("{0}|{1}".format(
                        inscripcion.cell("Capacitación >Curso >STPS Área temática >STPS Areatematica ID"),
                        inscripcion.cell("Capacitación >Curso >STPS Área temática >Nombre")), 9, 153.5);
                    var modulo = inscripcion.cell("Capacitación >Curso").val().relations("Modulos|Curso")[0];
                    doc.text(
                        "{0}|{1}".format(
                            modulo.cell("Tema >Instructor >Lugar >Empresa >Razón social"),
                            modulo.cell("Tema >Instructor >Lugar >Empresa >STPS Registro")),
                        9,
                        161.5);
                    //if (modulo.cell("Tema >Instructor >Firma").isVal()) {
                    //    doc.addImage(
                    //        modulo.cell("Tema >Instructor >Firma").val(),
                    //        "JPEG",
                    //        20.1 + modulo.cell("Tema >Instructor >FirmaX").val(),
                    //        185.3 + modulo.cell("Tema >Instructor >FirmaY").val());
                    //}
                    doc.setFontSize(7)
                        .text(
                            "{0} {1}, {2}".format(
                                modulo.cell("Tema >Instructor >Apellido paterno"),
                                modulo.cell("Tema >Instructor >Apellido materno"),
                                modulo.cell("Tema >Instructor >Nombre(s)")),
                            20.2,
                            195.5);
                    //if (inscripcion.cell("Representante legal >Firma").isVal()) {
                    //    doc.addImage(
                    //        inscripcion.cell("Representante legal >Firma").val(),
                    //        "JPEG",
                    //        75 + inscripcion.cell("Representante legal >FirmaX").val(),
                    //        185.3 + inscripcion.cell("Representante legal >FirmaY").val());
                    //}
                    doc.text(
                        "{0} {1}, {2}".format(
                            inscripcion.cell("Representante legal >Apellido paterno"),
                            inscripcion.cell("Representante legal >Apellido materno"),
                            inscripcion.cell("Representante legal >Nombre(s)")),
                        75.2,
                        195.5);
                    //if (inscripcion.cell("Representante trabajador >Firma").isVal()) {
                    //    doc.addImage(
                    //        inscripcion.cell("Representante trabajador >Firma").val(),
                    //        "JPEG",
                    //        134.9 + inscripcion.cell("Representante trabajador >FirmaX").val(),
                    //        185.3 + inscripcion.cell("Representante trabajador >FirmaY").val());
                    //}
                    doc.text(
                        "{0} {1}, {2}".format(
                            inscripcion.cell("Representante trabajador >Apellido paterno"),
                            inscripcion.cell("Representante trabajador >Apellido materno"),
                            inscripcion.cell("Representante trabajador >Nombre(s)")),
                        135,
                        195.5);
                    formatcode(doc);
                }
                $('<form>').prop('title', "Formatos DC-3")
                    .append($('<iframe style="width:100%;height:100%;margin-bottom: -7px;margin-right: -4px;">')
                        .prop('src', doc.output('datauristring')))
                    .dialog({ width: "1000px", modal: true, height: 900 });
            }
            function formatcode(doc) {
                doc = doc || new jsPDF(undefined, undefined, "letter");
                doc.setFont("helvetica").setFontType("normal").setFontSize(8)
                    .text(26, 12.9, "En este espacio la empresa puede imprimir su logotipo y, en su caso, también se puede imprimir el del agente capacitador externo.");
                doc.setFontSize(7.5)
                    .text(8.73, 60.54, "Nombre (Anotar apellido paterno, apellido materno y nombre (s))")
                    .text(8.73, 72, "Clave Única de Registro de Población")
                    .text(106.08, 72, "Ocupación específica (Catálogo Nacional de Ocupaciones)")
                    .text(8.73, 81.32, "Puesto*");
                doc.setFontType("bold").setFontSize(12).text(91.6, 41.4, "FORMATO DC-3");
                doc.setFontSize(12).text(37.9, 46.4, "CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES");
                doc.setFontType("normal").setFontSize(7.5);
                doc.text(8.73, 100.98, "Nombre o razón social (En caso de persona física, anotar apellido paterno, apellido materno y nombre(s))")
                    .text(8.73, 112.2, "Registro Federal de Contribuyentes con homoclave (SHCP)")
                    .text(8.73, 131.47, "Nombre del curso")
                    .text(8.73, 140.17, "Duración en horas")
                    .text(63.97, 140.17, "Periodo de")
                    .text(63.97, 144.2, "ejecución:      De")
                    .text(96.42, 140.17, "Año")
                    .text(115, 140.17, "Mes")
                    .text(130.52, 140.17, "Día")
                    .text(143, 144.2, "a")
                    .text(158.75, 140.17, "Año")
                    .text(180.27, 140.17, "Mes")
                    .text(195.67, 140.17, "Día")
                    .text(8.73, 148.88, "Área temática del curso")
                    .text(8.73, 157.6, "Nombre del agente capacitador o STPS ")
                    .text(35.62, 185.1, "Instructor o tutor")
                    .text(85.13, 185.1, "Patrón o representante legal")
                    .text(141.34, 185.1, "Representante de los trabajadores")
                    .text(141.34, 185.1, "Representante de los trabajadores")
                    .text(36.33, 199.99, "Nombre y firma")
                    .text(93.33, 199.99, "Nombre y firma")
                    .text(153.5, 199.99, "Nombre y firma");
                doc.setFont("times").setFontType("normal").setFontSize(7.5);
                doc.text(8.73, 212.14, "-")
                    .text(11.5, 212.14, "Llenar a máquina o con letra de molde.")
                    .text(8.73, 215.43, "-")
                    .text(11.5, 215.43, "Deberá entregarse al trabajador dentro de los veinte días hábiles siguientes al término del curso decapacitación aprobado.")
                    .text(11.5, 218.72, "Las áreas y subáreas ocupacionales del Catálogo Nacional de Ocupaciones se encuentran disponibles enel reverso de este formato y en la página")
                    .text(11.5, 222, "Las áreas temáticas de los cursos se encuentran disponibles en el reverso de este formato y en la página")
                    .text(11.5, 225.3, "Cursos impartidos por el área competente de la Secretaria del Trabajo y Previsión Social.")
                    .text(11.5, 228.59, "Para empresas con menos de 51 trabajadores. Para empresas con más de 50 trabajadores firmaría el representante del patrón ante la Comisión mixta de capacitación,")
                    .text(11.5, 231.88, "adiestramiento y productividad.")
                    .text(11.5, 235.17, "Sólo para empresas con más de 50 trabajadores.")
                    .text(8.73, 238.46, "*")
                    .text(11.5, 238.46, "Dato no obligatorio.")
                    .text(180, 241.4, "DC-3")
                    .text(175, 245, "ANVERSO")
                    .setFontSize(6.5)
                    .text(175.5, 71.4, "1/")
                    .text(36.89, 148.4, "2/")
                    .text(55.8, 157.2, "3/")
                    .text(119, 184.6, "4/")
                    .text(182.5, 184.6, "5/")
                    .text(8.73, 218.72, "1/")
                    .text(8.73, 222, "2/")
                    .text(8.73, 225.3, "3/")
                    .text(8.73, 228.59, "4/")
                    .text(8.73, 235.17, "5/");
                doc.rect(7.4, 49.3, 197.2, 7.2, "F")
                    .rect(7.4, 89.52, 197.2, 7.2, "F")
                    .rect(7.4, 120.75, 197.2, 7.2, "F");
                doc.setFont("helvetica").setFontType("bold").setFontSize(11).setTextColor(255, 255, 255);
                doc.text(81, 54.4, "DATOS DEL TRABAJADOR")
                    .rect(7.4, 56.2, 197.2, 31)
                    .text(83.5, 94.61, "DATOS DE LA EMPRESA")
                    .text(28, 125.3, "DATOS DEL PROGRAMA DE CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD")
                    .rect(7.4, 96.9, 197.2, 21.5)
                    .line(7.4, 68.97, 204.8, 68.97)
                    .line(7.4, 78.4, 204.8, 78.4)
                    .line(7.4, 109.18, 204.8, 109.18)
                    .rect(7.4, 128, 197.2, 34.7)
                    .line(7.4, 137.24, 204.8, 137.24)
                    .line(7.4, 145.7, 204.8, 145.7)
                    .line(7.4, 154.6, 204.8, 154.6)
                    .rect(7.4, 165.43, 197.2, 37.39)
                    .line(20.22, 196.15, 69.61, 196.15)
                    .line(75, 196.15, 129.93, 196.15)
                    .line(134.87, 196.15, 189.67, 196.15);
                doc.setLineWidth(0.1)
                    .line(104.7, 69.2, 104.7, 78.4);
                doc.setLineWidth(0.1)
                    .line(15, 72.9, 15, 78.4)
                    .line(20, 72.9, 20, 78.4)
                    .line(25, 72.9, 25, 78.4)
                    .line(30, 72.9, 30, 78.4)
                    .line(35, 72.9, 35, 78.4)
                    .line(40, 72.9, 40, 78.4)
                    .line(45, 72.9, 45, 78.4)
                    .line(50, 72.9, 50, 78.4)
                    .line(55, 72.9, 55, 78.4)
                    .line(60, 72.9, 60, 78.4)
                    .line(65, 72.9, 65, 78.4)
                    .line(70, 72.9, 70, 78.4)
                    .line(75, 72.9, 75, 78.4)
                    .line(82.5, 72.9, 82.5, 78.4)
                    .line(87.5, 72.9, 87.5, 78.4)
                    .line(92.5, 72.9, 92.5, 78.4)
                    .line(97.5, 72.9, 97.5, 78.4);
                doc.setLineWidth(0.1)
                    .line(15, 113.25, 15, 118.54)
                    .line(20, 113.25, 20, 118.54)
                    .line(25, 113.25, 25, 118.54)
                    .line(30, 113.25, 30, 118.54)
                    .line(35, 113.25, 35, 118.54)
                    .line(40, 113.25, 40, 118.54)
                    .line(45, 113.25, 45, 118.54)
                    .line(50, 113.25, 50, 118.54)
                    .line(55, 113.25, 55, 118.54)
                    .line(60, 113.25, 60, 118.54)
                    .line(65, 113.25, 65, 118.54)
                    .line(70, 113.25, 70, 118.54)
                    .line(75, 113.25, 75, 118.54)
                    .line(82.5, 113.25, 82.5, 118.54)
                    .line(87.5, 113.25, 87.5, 118.54);
                doc.line(62.5, 137.12, 62.5, 145.82)
                    .line(87.5, 137.12, 87.5, 145.82)
                    .line(110, 137.12, 110, 145.82)
                    .line(125, 137.12, 125, 145.82)
                    .line(140, 137.12, 140, 145.82)
                    .line(147.5, 137.12, 147.5, 145.82)
                    .line(175, 137.12, 175, 145.82)
                    .line(190, 137.12, 190, 145.82);
                doc.line(93, 140.74, 93, 145.82)
                    .line(98.5, 140.74, 98.5, 145.82)
                    .line(104, 140.74, 104, 145.82)
                    .line(117.5, 140.74, 117.5, 145.82)
                    .line(132.5, 140.74, 132.5, 145.82)
                    .line(154.5, 140.74, 154.5, 145.82)
                    .line(161, 140.74, 161, 145.82)
                    .line(168, 140.74, 168, 145.82)
                    .line(182.5, 140.74, 182.5, 145.82)
                    .line(197.5, 140.74, 197.5, 145.82);
                doc.line(32, 116.67, 33, 116.67)
                    .line(67, 116.67, 68, 116.67);
                doc.setFont("times").setFontType("normal").setTextColor(0, 0, 255).setFontSize(7.5)
                    .text(165, 218.72, "www.stps.gob.mx")
                    .text(122, 222, "www.stps.gob.mx");
                doc.setDrawColor(0, 0, 255)
                    .line(165, 219.2, 184, 219.2)
                    .line(122, 222.4, 141, 222.4);
                doc.setTextColor(0, 0, 0).setFont("helvetica").setFontType("bold")
                    .text(26, 171.14, "Los datos se asientan en esta constancia bajo protesta de decir verdad, apercibidos de la responsabilidad en que incurre todo")
                    .text(83, 177.33, "aquel que no se conduce con verdad.")
                    .text(8.73, 208.26, "INSTRUCCIONES");
                return doc;
            }
        }
        //,
        //        "Asistencias": {
        //    name: "Formato de asistencias",
        //    callback: function () {
        //        try {
        //            var capacitacion, rowformato;
        //            capacitacion = this.closest('tr').data('row');
        //            rowformato = capacitacion.rows('Empresa.Formato de asistencias') || capacitacion.table.database.tables('Formatos PDF').rows(5);

        //            $('<form>').prop('title', rowformato)
        //                .append($('<iframe style="width:100%;height:100%;margin-bottom: -7px;margin-right: -4px;">')
        //                    .prop('src', rowformato.cell('Código relleno').code(capacitacion).output('datauristring')))
        //                .dialog({
        //                    width: "1000px",
        //                    modal: true,
        //                    height: 900
        //                });
        //        } catch (e) { alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(e.message)); }
        //    }
        //        }
        //Programaciones
        database.tables({
            title: ['Programaciones', 'Programación', 'programaciones'],
            insert: false, update: true, delete: false,
            colsdef: ["Clave", "Capacitación >Curso", "Modulo >Tema", "Estado", "Asistencia", "Calificación inicial", "Calificación final"
                , "Fecha inicio", "Fecha fin", "Horas hombre", "Capacitación >Solicitante", "Capacitación >Coordinador", "Modulo >Tema >Instructor", "Modulo >Tema >Duración", "Sala", "Sala >Lugar", "Programación ID"],
            cols: [
                { title: 'Programación ID', identity: true},
                {
                    title: 'Capacitación', type: "Int", required: true, readonly: true
                    , colsdef: ["Programación ID", "Modulo >Tema", "Estado", "Asistencia", "Calificación inicial", "Calificación final", "Fecha inicio", 
					"Fecha fin", "Horas hombre", "Modulo >Tema >Instructor", "Modulo >Tema >Duración", "Sala", "Sala >Lugar", "Con calificación inicial", 
					"Con calificación final"]
                    , onChange: function (capacitacion, programacion) {
                        if (programacion.action() === "INSERT" && capacitacion.isVal()) {
                            for (var i = 0, inscripciones = capacitacion.val().relations("Inscripciones|Capacitación"), asistencia;
                                i < inscripciones.length; i++) {
                                asistencia = inscripciones[i].relations("Asistencias|Inscripción").new();
                                asistencia.cell("Programación").val(programacion);
                            }
                        }
                    }
                },
                {
                    title: 'Modulo', type: "Int", required: true, readonly: true, onChange: function (modulo, programacion) {
                        var fechainicio = programacion.cell("Fecha inicio");
                        if (fechainicio.isVal()) {
                            programacion.cell("Fecha fin").min = fechainicio.val().clone().add(modulo.val().cell("Tema >Duración").val());
                        } else { delete programacion.cell("Fecha fin").min; }
                    }
                },
                { title: 'Clave', required: true, transform: 'uppercase', maxlength: 20, sinacentos: true, str: true, indexMatch: true },
                { title: 'Sala', type: "Int" },
                {
                    title: 'Fecha inicio', type: 'Datetime', required: true, min: moment([2014]), max: moment().add(1, 'years').endOf('year')
                    , onChange: function (fechainicio, programacion) {
                        if (programacion.cell("Modulo").isVal()) {
                            programacion.cell("Fecha fin").min = fechainicio.val().clone().add(programacion.cell("Modulo >Tema >Duración").val());
                            if (!programacion.cell("Fecha fin").isVal()) { programacion.cell("Fecha fin").val(programacion.cell("Fecha fin").min.clone()); }
                        } else { delete programacion.cell("Fecha fin").min; }
                        programacion.cell("Fecha fin").reeval();
                    }
                },
                { title: 'Fecha fin', type: 'Datetime', required: true, min: moment([2014]), max: moment().add(2, 'years').endOf('year') },
                {
                    title: 'Con calificación inicial', type: "Bool", onChange: function (inicial, programacion) {
                        var asistencias = programacion.relations(database.tables("Asistencias").cols("Programación"));
                        if (!inicial.val() && asistencias.find(function (asistencia) { return asistencia.cell("Calificación inicial").isVal(); })) {
                            //inicial.val(true);
                            //alert("Antes de poder modificar este valor es necesario eliminar las calificaciones iniciales de las asistencias");
                        } else { for (var i = 0; i < asistencias.length; i++) { asistencias[i].cell("Calificación inicial").change("disabled", !inicial.val()); } }
                    }
                },
                {
                    title: 'Con calificación final', type: "Bool", onChange: function (final, programacion) {
                        var asistencias = programacion.relations(database.tables("Asistencias").cols("Programación"));
                        if (!final.val() && asistencias.find(function (asistencia) { return asistencia.cell("Calificación final").isVal(); })) {
                            //final.val(true);
                            //alert("Antes de poder modificar este valor es necesario eliminar las calificaciones finales de las asistencias");
                        } else { for (var i = 0; i < asistencias.length; i++) { asistencias[i].cell("Calificación final").change("disabled", !final.val()); } }
                    }
                },
                { title: 'Estado', type: "Int", readonly: true },
                { title: 'Asistencia', type: "Int", readonly: true },
                { title: 'Calificación inicial', type: "Int", readonly: true },
                { title: 'Calificación final', type: "Int", readonly: true },
                { title: 'Horas hombre', type: 'Duration', readonly: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }],
            indexes: [['Capacitación', 'Modulo']]
        });
        //Inscripciones
        database.tables({
            title: ['Inscripciones', 'Inscripción', 'inscripciones'],
            insert: true, update: true, delete: true,
            colsdef: [
				'Inscripción ID', 'Alumno', 'Capacitación >Curso', 'Estado', 'Asistencia', 'Calificación inicial', 'Calificación final', "Fecha inicio", 
				"Fecha fin", 'Horas hombre', 'Alumno >COMEX ID', 'Alumno >Lugar', 'Alumno >Lugar >Empresa', 'Alumno >Puesto', 
				'Alumno >Centro de costos', 'Alumno >Tipo colaborador', 'Alumno >Nivel', 'Alumno >Dirección', 'Alumno >Jefe', 'Alumno >Email', 
				'Alumno >Alta', 'Alumno >Baja', 'Capacitación', 'Capacitación >Coordinador', 'Capacitación >Solicitante', 'Capacitación >Curso >Categoría', 
				'Capacitación >Curso >Duración', "Sesión insertado >Colaborador"
			],
            orderdef: ['Alumno', 'Capacitación >Fecha inicio'],
            cols: [
                { title: 'Inscripción ID', identity: true, str: true },
                {
                    title: 'Capacitación', type: "Int", required: true, readonly: true
                    , colsdef: ["Inscripción ID", "Alumno", "Estado", "Asistencia", "Calificación inicial", "Calificación final", "Fecha inicio", "Fecha fin"
                        , "Horas hombre", "Representante legal", "Representante trabajador"]
                    , onChange: function (capacitacion, inscripcion) {
                        if (inscripcion.action() === "INSERT" && capacitacion.isVal()) {
                            var programaciones = capacitacion.val().relations(database.tables("Programaciones").cols("Capacitación"));
                            var asistencias = inscripcion.relations(database.tables("Asistencias").cols("Inscripción"));
                            if (!asistencias.length) {
                                for (var i = 0; i < programaciones.length; i++) {
                                    var asistencia = asistencias.new();
                                    asistencia.cell("Programación").val(programaciones[i]);
                                }
                            }
                        }
                    }
                },
                { title: 'Alumno', type: "Int", required: true },
                { title: 'Estado', type: "Int", readonly: true },
                { title: 'Asistencia', type: 'Int', readonly: true },
                { title: 'Calificación inicial', type: 'Int', readonly: true },
                { title: 'Calificación final', type: 'Int', readonly: true },
                { title: 'Fecha inicio', type: 'Datetime', readonly: true },
                { title: 'Fecha fin', type: 'Datetime', readonly: true },
                { title: 'Horas hombre', type: 'Duration', readonly: true },
                { title: 'Representante legal', type: "Int" },
                { title: 'Representante trabajador', type: "Int" },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }
            ],
            indexes: [['Capacitación', 'Alumno']]
        });
        //Asistencias
        database.tables({
            title: ['Asistencias', 'Asistencia', 'asistencias'],
            insert: false, update: true, delete: false,
            colsdef: [
                "Asistencia ID", "Inscripción >Alumno", "Programación >Modulo >Tema", "Estado", "Asistencia", "Calificación inicial", "Calificación final",
                "Programación >Fecha inicio", "Programación >Fecha fin", "Horas hombre", "Inscripción", "Inscripción >Alumno >COMEX ID", 
				"Inscripción >Alumno >Lugar", "Inscripción >Alumno >Lugar >Empresa", "Inscripción >Alumno >Lugar >Municipio >Entidad",
                "Inscripción >Alumno >Lugar >Municipio >Entidad >País", "Inscripción >Alumno >Puesto", "Inscripción >Alumno >Centro de costos",
                "Inscripción >Alumno >Tipo colaborador", "Inscripción >Alumno >Nivel", "Inscripción >Alumno >Dirección", "Inscripción >Alumno >Jefe",
                "Inscripción >Alumno >Email", "Inscripción >Alumno >Alta", "Inscripción >Alumno >Baja", "Programación", "Programación >Capacitación",
                "Programación >Capacitación >Lugar", "Programación >Capacitación >Lugar >Empresa", "Programación >Capacitación >Lugar >Municipio >Entidad",
                "Programación >Capacitación >Lugar >Municipio >Entidad >País", "Programación >Capacitación >Coordinador", 
				"Programación >Capacitación >Solicitante", "Programación >Capacitación >Curso", "Programación >Capacitación >Curso >Clave", 
				"Programación >Capacitación >Curso >Categoría", "Programación >Modulo >Tema >Instructor", "Programación >Modulo >Tema >Instructor >Lugar",
                "Programación >Modulo >Tema >Instructor >Lugar >Empresa", "Programación >Modulo >Tema >Instructor >Lugar >Municipio >Entidad",
                "Programación >Modulo >Tema >Instructor >Lugar >Municipio >Entidad >País", "Programación >Modulo >Tema >Duración",
                "Programación >Sala", "Programación >Sala >Lugar", "Programación >Sala >Lugar >Empresa", "Programación >Sala >Lugar >Municipio >Entidad",
                "Programación >Sala >Lugar >Municipio >Entidad >País", "Fecha insertado", "Sesión insertado >Colaborador"
            ],
            cols: [
                { title: "Asistencia ID", identity: true, str: true },
                {
                    title: 'Programación', type: "Int", required: true, readonly: true,
                    colsdef: [
						"Asistencia ID", "Inscripción", "Inscripción >Alumno", "Estado", "Asistencia", "Calificación inicial", "Calificación final", 
						"Horas hombre"
					]
                    , onChange: function (programacion, asistencia) {
                        if ((programacion = programacion.val())) {
                            asistencia.cell("Calificación inicial").change("disabled", !programacion.cell("Con calificación inicial").val());
                            asistencia.cell("Calificación final").change("disabled", !programacion.cell("Con calificación final").val());
                        }
                    }
                },
                {
                    title: 'Inscripción', type: "Int", required: true, readonly: true,
                    colsdef: ["Asistencia ID", "Programación >Modulo >Tema", "Estado", "Asistencia", "Calificación inicial", "Calificación final"
                        , "Programación >Fecha inicio", "Programación >Fecha fin", "Horas hombre", "Programación >Modulo >Tema >Instructor"
                        , "Programación >Sala", "Programación"]
                },
                { title: "Estado", type: "Int", readonly: true },
                {
                    title: 'Asistencia', type: 'Int', min: 75, max: 100, explicacion: "El número debe manejarse en procentaje del 75 a 100"
                    , onChange: function (asistencia, asistencia_row) {
                        estado(asistencia_row);
                        if (asistencia.isVal()) {
                            asistencia_row.cell("Horas hombre").val(moment.duration(asistencia_row.cell("Programación >Modulo >Tema >Duración") * asistencia / 100));
                        } else { asistencia_row.cell("Horas hombre").val(null); }
                    }
                },
                { title: 'Calificación inicial', type: 'Int', min: 0, max: 100, explicacion: "El número debe manejarse en procentaje del 0 a 100" },
                {
                    title: 'Calificación final', type: 'Int', min: 0, max: 100, explicacion: "El número debe manejarse en procentaje del 0 a 100"
                    , onChange: function (final, asistencia_row) { estado(asistencia_row); }
                },
                { title: 'Horas hombre', type: 'Duration', readonly: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }
            ],
            indexes: [['Programación', 'Inscripción']]
        });
        //Cursos
        database.tables({
            title: ['Cursos', 'Curso', 'cursos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Curso ID', identity: true },
                { title: 'Curso', readonly: true, str: true },
                { title: 'Estado', type: "Int", readonly: true },
                { title: 'Nombre', maxlength: 150, required: true, transform: 'uppercase' },
                { title: 'Clave', maxlength: 20, required: true, unique: true, transform: 'uppercase', sinacentos: true, indexMatch: true },
                { title: 'Categoría', type: "Int" },
                { title: 'Objetivo general', type: 'Textarea', maxlength: 1000 },
                { title: 'Temario', type: 'Textarea', maxlength: 2000 },
                { title: 'Documento académico', type: "Int" },
                { title: 'Norma', type: "Int" },
                { title: 'STPS Área temática', type: "Int" },
                { title: 'STPS Objetivo', type: "Int" },
                { title: 'Capacitaciones', type: 'Int', readonly: true },
                { title: 'Inscripciones', type: 'Int', readonly: true },
                { title: 'Asistencia', type: 'Int', readonly: true },
                { title: 'Calificación inicial', type: 'Int', readonly: true },
                { title: 'Calificación final', type: 'Int', readonly: true },
                { title: 'Fecha inicio', type: 'Datetime', readonly: true },
                { title: 'Fecha fin', type: 'Datetime', readonly: true },
                { title: 'Horas hombre', type: 'Duration', readonly: true },
                { title: 'Modulos', type: 'Int', readonly: true },
                { title: 'Duración', type: 'Duration', readonly: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }
			]
        });
        //Curso estados
        database.tables({
            title: ['Curso estados', 'Curso estado', 'cursoestados'],
            insert: true, update: true, delete: false,
            cols: [
                { title: 'Estado ID', identity: true },
                { title: 'Estado', str: true, maxlength: 50 },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }]
        });
        //Temas
        database.tables({
            title: ['Temas', 'Tema', 'temas'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Tema ID', identity: true },
                { title: 'Tema', str: true, readonly: true },
                { title: 'Nombre', maxlength: 150, required: true, transform: 'uppercase' },
                { title: 'Instructor', type: "Int", required: true },
                { title: 'Duración', type: "Duration", min: moment.duration("00:10", "HH:mm"), max: moment.duration("10:00", "HH:mm"), required: true, explicacion: "Útiliza el formato HH:MM" },
                { title: 'Descripción', type: 'Textarea', maxlength: 1000 },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }],
            indexes: [['Instructor', 'Nombre', 'Duración']]
        });
        //Modulos
        database.tables({
            title: ['Modulos', 'Modulo', 'modulos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Modulo ID', identity: true, str: true },
                {
                    title: 'Curso', type: "Int", required: true, readonly: true, colsdef: ["Tema", "Tema >Instructor", "Tema >Duración"], onChange: function (curso, modulo) {
                        if (modulo.action() === "INSERT" && curso.isVal()) {
                            for (var i = 0, capacitaciones = curso.val().relations("Capacitaciones|Curso"), capacitacion, programacion;
                                i < capacitaciones.length; i++) {
                                capacitacion = capacitaciones[i];
                                var calificacionMinima = capacitacion.cell("Calificación mínima");
                                programacion = capacitacion.relations("Programaciones|Capacitación").new();
                                programacion.cell("Modulo").val(modulo);
                                programacion.cell("Con calificación inicial").change("disabled", !calificacionMinima.isVal());
                                programacion.cell("Con calificación final").change("disabled", !calificacionMinima.isVal()).val(calificacionMinima.isVal());
                            }
                        }
                    }
                },
                { title: 'Tema', type: "Int", required: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }],
            indexes: [['Curso', 'Tema']]
        });
        var nombre = {
			//http://stackoverflow.com/questions/5524842/have-html5s-a-inputs-pattern-attribute-ignore-case
            pattern: /^[A-ZÑÁÉÍÓÚÜÖ][A-ZÑÁÉÍÓÚÜÖ.'\/\s-]*$/i,
            message: function (val) {
                for (var i = 0; i < val.length; i++) {
                    if (i === 0) { if (!nombre.t0.test(val[i])) { return "Posición {0}: solo acepta caracteres A-ZÑÁÉÍÓÚÜÖ".format(i + 1); } }
                    if (!nombre.t1.test(val[i])) { return "Posición {0}: solo acepta caracteres A-ZÑÁÉÍÓÚÜÖ.'/-".format(i + 1); }
                }
            },
            t0: /[A-ZÑÁÉÍÓÚÜÖ]/i,
            t1: /[A-ZÑÁÉÍÓÚÜÖ.'\/\s-]/i
        }
        function NSS(nss) {
            //http://imss-ayuda.blogspot.com/2011/09/calcular-el-digito-verificador-del-imss.html
            nss = ("0" + nss).slice(-11);
            var sum = 0;
            for (var i = 0; i < 10; i++) { sum += i % 2 ? NSS.t1[nss[i]] : nss[i]; }
            return nss[10] === (Math.ceil(sum / 10) * 10) - sum;
        }
		NSS.t1 = { "0": 0, "1": 2, "2": 4, "3": 6, "4": 8, "5": 1, "6": 3, "7": 5, "8": 7, "9": 9 }
		function titleCase(str){
			if(!str){ return str; }
			str = str.toUpperCase().split(" ");
			for(var i = 0, part; i < str.length; i++){
				if(titleCase.exepcions.contains(str[i])){ str[i] = str[i].toLowerCase(); }
				else{ str[i] = str[i][0] + str[i].slice(1).toLowerCase(); }
			}
			return str.join(" ");
		}
		titleCase.exepcions = ["DE", "DEL", "EL", "LA", "LOS", "LAS", "Y"];
		
        //Colaboradores
        database.tables({
            title: ['Colaboradores', 'Colaborador', 'aut_domainusers'],
            insert: true, update: true, delete: true,
			colsdef: [
				"Colaborador ID", "COMEX ID", "PPG ID", "LATAM ID", "Contractor ID", "Colaborador", "Posición", "Posición >COMEX ID", "Posición >Lugar", 
				"Posición >Lugar >Empresa", "Posición >Lugar >Empresa >Tipo", "Posición >Lugar >Municipio >Entidad", 
				"Posición >Lugar >Municipio >Entidad >País", 'Posición >Lugar >Posición JC >Colaborador', 'Posición >Lugar >Posición JC >Email', 
				"Posición >Puesto", "Posición >Puesto >Nivel", "Posición >Centro de costos", "Posición >Dirección", 
				"Posición >Dirección >Posición BP >Colaborador", "Posición >Dirección >Posición BP >Email", "Posición >Tipo", 
				"Posición >Posición jefe >Colaborador", "Posición >Posición jefe >Email", "Posición >Posición director >Colaborador", "Posición >Email", 
				"Posición >Email capturado", "Posición >Email seguimiento", "Posición >Email confirmado", "Posición >Email confirmado fecha", 
				"Posición >Teléfono", "Posición >Teléfono móvil", "Posición >Banda", "Posición >Equipo", "Posición >Equipo capturado", 
				"Posición >Incapacidad", "Posición >Alta", "Posición >Baja", "Posición >Fecha actualizado", "Posición >Fecha insertado", "Apellido paterno", 
				"Apellido materno", "Nombre(s)", "Teléfono móvil", "Email", "Usuario", "Fecha nacimiento", "Sexo", "CURP", "CURP valido", "RFC", 
				"RFC valido", "CAE ID", "Último acceso", "Actualizado por", "Fecha actualizado", "Fecha insertado", "Insertado por"
			],
            cols: [
                { title: 'Colaborador ID', identity: true },
                { title: 'PPG ID', type: 'Int', min: 105789, max: 499999, unique: true, explicacion: "Número de empleado" },
                { title: 'Colaborador', readonly: true, str: true },
                { 
					title: 'Apellido paterno', minlength: 2, maxlength: 30, required: true, pattern: nombre, 
					onChange: function (cell, colaborador) {
						cell._val = titleCase(cell._val);
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                        colaborador.cell("RFC").reeval();
                    }
				},
                { 
					title: 'Apellido materno', maxlength: 30, pattern: nombre, 
					onChange: function (cell, colaborador) {
						cell._val = titleCase(cell._val);
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                        colaborador.cell("RFC").reeval();
                    }
				},
                { 
					title: 'Nombre(s)', minlength: 3, maxlength: 40, required: true, pattern: nombre, 
					onChange: function (cell, colaborador) {
						cell._val = titleCase(cell._val);
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                        colaborador.cell("RFC").reeval();
                    }
				},
                { title: 'COMEX ID', type: 'Int', min: 105789, max: 90015000, unique: true, explicacion: "Número de empleado" },
                { title: 'Contractor ID', type: 'Int', min: 2010, max: 29999, unique: true },
                { title: 'LATAM ID', type: 'Int', min: 501001, max: 520000, unique: true, explicacion: "Número de empleado en base de datos LATAM" },
                { title: 'Posición', type: "Int", unique: true },
                { title: 'Teléfono móvil', minlength: 6, maxlength: 27, pattern: $.comex.phonemovil, transform: 'lowercase', unique: true, indexMatch: true },
                { 
					title: 'Email', type: 'Email', maxlength: 100, unique: true, indexMatch: true, 
					badInput: function(email){
						if(["ppg.com", "comex.com.mx", "pinturascomex.com", "pinturasglidden.com"].contains(email._val.substring(email._val.indexOf("@") + 1))){ 
							return "Dominio no valido"; 
						}
					} 
				},
                { title: 'Usuario', minlength: 6, maxlength: 16, unique: true, transform: 'lowercase', indexMatch: true },
                {
                    title: 'Fecha nacimiento', type: 'Date', min: moment([1900]), max: moment().subtract(15, 'year').endOf('year'), 
					onChange: function (fechadenacimiento, colaborador) {
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                        colaborador.cell("RFC").reeval();
                    }
                },
                {
                    title: 'Sexo', type: "Int", onChange: function (sexo, colaborador) {
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                    }
                },
                {
                    title: 'CURP', minlength: 18, maxlength: 18, unique: true, pattern: $.comex.CURP, transform: 'uppercase', indexMatch: true
                    , badInput: function (curp) {
						var row = curp.row;
                        row.close = true;
						curp = curp._val;
						var texterror = [];
						if(!CURP.test(curp)){ texterror.push("Posición 18: Digito verificador invalido ({0})".format(CURP.dv(curp))); }
						var obcurp = CURP(
							row.val("Apellido paterno"),
							row.val("Apellido materno"),
							row.val("Nombre(s)"),
							row.val("Fecha nacimiento"),
							row.val("Sexo >Sexo")
						);
						if(obcurp[0] !== "." && obcurp[0] !== curp[0]){ texterror.push("Posición 1: Apellido paterno primera letra no coincide"); }
						if(obcurp[1] !== "." && obcurp[1] !== curp[1] && !row.val("CURP valido")){ 
							texterror.push("Posición 2: Apellido paterno primera vocal interna no coincide"); 
						}
						if(obcurp[2] !== "." && obcurp[2] !== curp[2]){ texterror.push("Posición 3: Apellido materno primera letra no coincide"); }
						if(obcurp[3] !== "." && obcurp[3] !== curp[3]){ texterror.push("Posición 4: Nombre(s) primera letra no coincide"); }
						if(obcurp.slice(4, 6) !== ".." && obcurp.slice(4, 6) !== curp.slice(4, 6)){ texterror.push("Posición 5-6: Fecha nacimiento año no coincide"); }
						if(obcurp.slice(6, 8) !== ".." && obcurp.slice(6, 8) !== curp.slice(6, 8)){ texterror.push("Posición 7-8: Fecha nacimiento mes no coincide"); }
						if(obcurp.slice(8, 10) !== ".." && obcurp.slice(8, 10) !== curp.slice(8, 10)){ texterror.push("Posición 9-10: Fecha nacimiento día no coincide"); }
						if(obcurp[10] !== "." && obcurp[10] !== curp[10]){ texterror.push("Posición 11: Sexo no coincide"); }
						if(obcurp.slice(11, 13) !== ".." && obcurp.slice(11, 13) !== curp.slice(11, 13)){ texterror.push("Posición 12-13: Entidad de nacimiento no coincide"); }
						if(obcurp[13] !== "." && obcurp[13] !== curp[13]){ texterror.push("Posición 14: Apellido paterno primera consonante interna no coincide"); }
						if(obcurp[14] !== "." && obcurp[14] !== curp[14]){ texterror.push("Posición 15: Apellido materno primera consonante interna no coincide"); }
						if(obcurp[15] !== "." && obcurp[15] !== curp[15]){ texterror.push("Posición 16: Nombre(s) primera consonante interna no coincide"); }
						if(row.val("Fecha nacimiento")){
							if(row.val("Fecha nacimiento").year() < 2000 && isNaN(curp[16])){ texterror.push("Posición 17: Diferenciador de homonima para nacidos antes del 2000 debe ser número"); }
							if(row.val("Fecha nacimiento").year() >= 2000 && !isNaN(curp[16])){ texterror.push("Posición 17: Diferenciador de homonima para nacidos en 2000 o posterior debe ser letra"); }
						}
                        delete row.close;
						return texterror.length && texterror.join("\n");
                    }
                },
                { 
					title: 'CURP valido', type: 'Bool', 
					onChange: function (cell, colaborador) {
                        if (colaborador.close) { return; }
                        colaborador.cell("CURP").reeval();
                    }  
				},
                { title: 'CURP inexistente', type: 'Bool' },
                {
                    title: 'RFC', minlength: 13, maxlength: 13, unique: true, pattern: $.comex.RFC_F, transform: 'uppercase', indexMatch: true
                    , badInput: function (rfc) {
						var row = rfc.row;
                        row.close = true;
						rfc = rfc._val;
						var texterror = [];
						if(!RFC.test(rfc)){ texterror.push("Posición 13: Digito verificador invalido ({0})".format(RFC.dv(rfc))); }
						var obrfc = RFC(
							row.val("Apellido paterno"), 
							row.val("Apellido materno"), 
							row.val("Nombre(s)"), 
							row.val("Fecha nacimiento")
						);
						if(obrfc[0] !== "." && obrfc[0] !== rfc[0]){ texterror.push("Posición 1: Apellido paterno primera letra no coincide"); }
						if(obrfc[1] !== "." && obrfc[1] !== rfc[1]){ texterror.push("Posición 2: Apellido paterno primera vocal interna no coincide"); }
						if(obrfc[2] !== "." && obrfc[2] !== rfc[2]){ texterror.push("Posición 3: Apellido materno primera letra no coincide"); }
						if(obrfc[3] !== "." && obrfc[3] !== rfc[3]){ texterror.push("Posición 4: Nombre primera letra no coincide"); }
						if(obrfc.slice(4, 6) !== ".." && obrfc.slice(4, 6) !== rfc.slice(4, 6)){ texterror.push("Posición 5-6: Fecha nacimiento año no coincide"); }
						if(obrfc.slice(6, 8) !== ".." && obrfc.slice(6, 8) !== rfc.slice(6, 8)){ texterror.push("Posición 7-8: Fecha nacimiento mes no coincide"); }
						if(obrfc.slice(8, 10) !== ".." && obrfc.slice(8, 10) !== rfc.slice(8, 10)){ texterror.push("Posición 9-10: Fecha nacimiento día no coincide"); }
						if(obrfc.slice(10, 12) !== ".." && obrfc.slice(10, 12) !== rfc.slice(10, 12) && !row.val("RFC valido")){ 
							texterror.push("Posición 11-12: Diferenciador de homonima no coincide ({0})".format(obrfc.slice(10, 12))); 
						}
                        delete row.close;
						return texterror.length && texterror.join("\n");
                    }
                },
                { 
					title: 'RFC valido', type: 'Bool', 
					onChange: function (cell, colaborador) {
                        if (colaborador.close) { return; }
                        colaborador.cell("RFC").reeval();
                    } 
				},
                { title: 'RFC inexistente', type: 'Bool' },
                { title: 'CAE ID', type: "Int", min: 1, max: 49999, unique: true },
                { title: 'Último acceso', type: "Datetime", readonly: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
		function CURP(apellidoPaterno, apellidoMaterno, nombres, fechaNacimiento, sexo, entidadNacimiento) {
			var curp = "..................";
			var R1 = [false, false, false]; //inicial de pellidos o nombre  ñ
			var R2 = false; //nomre compuesto e inicia on maria o jose
			var R3 = [false, false, false, false]; //apellido o nombre caracter especial
			var R6 = [false, false, false]; //apllido o nombre comienza con prepocicion conjucion o contraccion
			var R7 = false; //en lista de palabras antisonantes
			var R8 = false; //apellido sin vocal interna
			var R9 = false; //sin segundo apellido
			var R10 = [false, false, false]; //primera consonante es ñ
			var R11 = [false, false, false]; //no existe consonante interna
			var carater;
			var index = [0, 0, 0];
			var split;
			if (apellidoPaterno) {
				apellidoPaterno = CURP.CI_AI(apellidoPaterno);
				split = apellidoPaterno.split(" ");
				for (var i = 0; i < split.length - 1 && CURP.R6.contains(split[i]); i++) { R6[0] = true; index[0] += split[i].length + 1; }
				carater = split[i][0];
				R1[0] = carater === "Ñ";
				R3[0] = CURP.R3.contains(carater);
				curp = curp.replaceAt(0, R1[0] || R3[0] ? "X" : carater);
				carater = CURP.T2(split[i]);
				R3[1] = CURP.R3.contains(carater);
				R8 = !carater;
				curp = curp.replaceAt(1, R3[1] || R8 ? "X" : carater);
				carater = CURP.P14(split[i]);
				R10[0] = carater === "Ñ";
				R11[0] = !carater;
				curp = curp.replaceAt(13, R10[0] || R11[0] ? "X" : carater);
				R9 = apellidoMaterno === null;
			}
			else if (apellidoMaterno) { R9 = apellidoPaterno === null; }
			if (apellidoPaterno !== undefined && apellidoMaterno) {
				apellidoMaterno = CURP.CI_AI(apellidoMaterno);
				split = apellidoMaterno.split(" ");
				for (var i = 0; i < split.length - 1 && CURP.R6.contains(split[i]); i++) { R6[1] = true; index[1] += split[i].length + 1; }
				carater = split[i][0];
				R1[1] = carater === "Ñ";
				if (R9) {
					R3[0] = CURP.R3.contains(carater);
					curp = curp.replaceAt(0, R1[1] || R3[0] ? "X" : carater);
					carater = CURP.T2(split[i]);
					R3[1] = CURP.R3.contains(carater);
					R8 = !carater;
					curp = curp.replaceAt(1, R3[0] || R8 ? "X" : carater);
					carater = CURP.P14(split[i]);
					R10[1] = carater === "Ñ";
					R11[1] = !carater;
					curp = curp.replaceAt(13, R10[1] || R11[1] ? "X" : carater);
				}
				else {
					R3[2] = CURP.R3.contains(carater);
					curp = curp.replaceAt(2, R1[1] || R3[2] ? "X" : carater);
					carater = CURP.P14(split[i]);
					R10[1] = carater === "Ñ";
					R11[1] = !carater;
					curp = curp.replaceAt(14, R10[1] || R11[1] ? "X" : carater);
				}
			}
			if (R9) {
				curp = curp.replaceAt(2, "X");
				curp = curp.replaceAt(14, "X");
			}
			if (nombres) {
				nombres = CURP.CI_AI(nombres);
				split = nombres.split(" ");
				i = 0;
				if (split.length > 1 && CURP.R2.contains(split[i])) { R2 = true; index[2] = split[i].length + 1; i = 1; }
				for (; i < split.length - 1 && CURP.R6.contains(split[i]); i++) { R6[2] = true; index[2] += split[i].length + 1; }
				carater = split[i][0];
				R1[2] = carater === "Ñ";
				R3[3] = CURP.R3.contains(carater);
				curp = curp.replaceAt(3, R1[2] || R3[3] ? "X" : carater);
				carater = CURP.P14(split[i]);
				R10[2] = carater === "Ñ";
				R11[2] = !carater;
				curp = curp.replaceAt(15, R10[2] || R11[2] ? "X" : carater);
			}
			if (CURP.A2.contains(curp.slice(0, 4))) { R7 = true; curp = curp.replaceAt(1, "X"); }
			if (fechaNacimiento) { curp = curp.replaceAt(4, fechaNacimiento.format("YYMMDD")); }
			if (sexo) { curp = curp.replaceAt(10, sexo); }
			if (entidadNacimiento) { curp = curp.replaceAt(11, CURP.A4[entidadNacimiento] || "NE"); }
			return curp;
		}
		CURP.CI_AI = function (val) {
			val = val.toUpperCase();
			for(var repl_i = 0, ci; repl_i < CURP.CI_AI_t.length; repl_i++){
				for(ci = 0; ci < CURP.CI_AI_t[repl_i][0].length; ci++){ val = val.replaceAll(CURP.CI_AI_t[repl_i][0][ci], CURP.CI_AI_t[repl_i][1]); }
			}
			return val;
		};
		CURP.CI_AI_t = [["Á","A"], ["É","E"], ["Í","I"], ["ÓÖ","O"], ["ÚÜ","U"]];
		CURP.T2 = function (word) {
			for (var i = 1, t; i < word.length; i++) { if (CURP.vocales.contains(word[i]) || CURP.R3.contains(word[i])) { return word[i]; } }
		};
		CURP.P14 = function (word) {
			for (var i = 1; i < word.length; i++) { if (!(CURP.vocales.contains(word[i]) || CURP.R3.contains(word[i]))) { return word[i]; } }
		}
		CURP.vocales = ["A", "E", "I", "O", "U"];
		CURP.R2 = ["MARIA", "MA.", "MA", "M.", "JOSE", "J", "J."];
		CURP.R3 = ["/", "-", "."];
		CURP.R6 = ["DA", "DAS", "DE", "DEL", "DER", "DI", "DIE", "DD", "EL", "LA", "LOS", "LAS", "LE", "LES", "MAC", "MC", "VAN", "VON", "Y"];
		CURP.A2 = [
			"BACA", "BAKA", "BUEI", "BUEY", "CACA", "CACO", "CAGA", "CAGO", "CAKA", "CAKO", "COGE", "COGI", "COJA",
			"COJE", "COJI", "COJO", "COLA", "CULO", "FALO", "FETO", "GETA", "GUEI", "GUEY", "JETA", "JOTO", "KACA",
			"KACO", "KAGA", "KAGO", "KAKA", "KAKO", "KOGE", "KOGI", "KOJA", "KOJE", "KOJI", "KOJO", "KOLA", "KULO",
			"LILO", "LOCA", "LOCO", "LOKA", "LOKO", "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MIAR", "MION", "MOCO",
			"MOKO", "MULA", "MULO", "NACA", "NACO", "PEDA", "PEDO", "PENE", "PIPI", "PITO", "POPO", "PUTA", "PUTO",
			"QULO", "RATA", "ROBA", "ROBE", "ROBO", "RUIN", "SENO", "TETA", "VACA", "VAGA", "VAGO", "VAKA", "VUEI",
			"VUEY", "WUEI", "WUEY"
		];
		CURP.A4 = {
			"AGUASCALIENTES": "AS",
			"BAJA CALIFORNIA": "BC",
			"BAJA CALIFORNIA SUR": "BS",
			"CAMPECHE": "CC",
			"COAHUILA": "CL",
			"COLIMA": "CM",
			"CHIAPAS": "CS",
			"CHIHUAHUA": "CH",
			"DISTRITO FEDERAL": "DF",
			"DURANGO": "DG",
			"GUANAJUATO": "GT",
			"GUERRERO": "GR",
			"HIDALGO": "HG",
			"JALISCO": "JC",
			"MÉXICO": "MC",
			"MICHOACÁN": "MN",
			"MORELOS": "MS",
			"NAYARIT": "NT",
			"NUEVO LE”N": "NL",
			"OAXACA": "OC",
			"PUEBLA": "PL",
			"QUERÉTARO": "QT",
			"QUINTANA ROO": "QR",
			"SAN LUIS POTOSÍ": "SP",
			"SINALOA": "SL",
			"SONORA": "SR",
			"TABASCO": "TC",
			"TAMAULIPAS": "TS",
			"TLAXCALA": "TL",
			"VERACRUZ": "VZ",
			"YUCATÁN": "YN",
			"ZACATECAS": "ZS"
		};
		CURP.dv = function (curp) {
			//http://www.todoexcel.com/foro-excel/macros/algoritmo-pra-determinar-rfc-curp-mexico-t975.html
			//http://www.ordenjuridico.gob.mx/Federal/PE/APF/APC/SEGOB/Instructivos/InstructivoNormativo.pdf
			var dv = 0;
			for (var i = 0; i < 17; i++) { dv += (CURP.A5[curp[i]] || 0) * (18 - i); }
			dv = 10 - dv % 10;
			return (dv === 10 ? 0 : dv) + "";
		};
		CURP.test = function(curp){ return curp[17] === CURP.dv(curp); };
		CURP.A5 = {
			"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
			"A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17, "I": 18, "J": 19,
			"K": 20, "L": 21, "M": 22, "N": 23, "Ñ": 24, "O": 25, "P": 26, "Q": 27, "R": 28, "S": 29,
			"T": 30, "U": 31, "V": 32, "W": 33, "X": 34, "Y": 35, "Z": 36, " ": 37
		};
		
		
		function RFC(apellidoPaterno, apellidoMaterno, nombres, fechaNacimiento){
			//https://www.consisa.com.mx/paginas/como_calcular_RFC.php
			//https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&cad=rja&uact=8&ved=0ahUKEwjG7vGwyd3OAhVMox4KHUNpAXEQFggmMAI&url=https%3A%2F%2Fblog.todoconta.com%2Fque-es-el-rfc-y-como-se-determina%2F&usg=AFQjCNFnKw4RNYwJbdwWC2VPHutAU23ULQ
			var homoclave = true;
			var result = ".............";
			var indexes = [0, 0, 0];
			var R4 = false; //Apellido paterno solo tiene 1 o 2 letras
			var R6 = false; //nombre compuesto y comienza con maria o jose
			var R7 = false; //tiene un solo apellido
			var R8 = [false, false, false]; //nombre tiene preposicion, conjuncion o contraccion
			var R9 = false; //resultado en lista de palabras inconvenientes
			var split, i;
			if(apellidoPaterno){
				apellidoPaterno = RFC.CI_AI(apellidoPaterno);
				split = apellidoPaterno.split(" ");
				for(i = 0; i < split.length - 1 && RFC.A5.contains(split[i]); i++){ R8[0] = true; indexes[0] += split[i].length + 1; }
				result = result.replaceAt(0, split[i][0]);
				if(split[i].length < 3){ R4 = true; }
				else{ 
					i = RFC.voalInterna(split[i]);
					if(i){ result = result.replaceAt(1, i); }
					else{ R4 = true; }
				}
				R7 = apellidoMaterno === null;
			}
			else if(apellidoPaterno === null){
				if(apellidoMaterno){ R7 = true; apellidoPaterno = ""; }
				else{ homoclave = false; }
			}
			else{ homoclave = false; }
			if(apellidoMaterno && apellidoPaterno !== undefined){
				apellidoMaterno = RFC.CI_AI(apellidoMaterno);
				split = apellidoMaterno.split(" ");
				for(i = 0; i < split.length - 1 && RFC.A5.contains(split[i]); i++){ R8[1] = true; indexes[1] += split[i].length + 1; }
				if(R4){ result = result.replaceAt(1, split[i][0]); }
				else if(R7){
					result = result.replaceAt(0, split[i][0]);
					result = result.replaceAt(1, RFC.voalInterna(split[i]) || "-");
				}
				else { result = result.replaceAt(2, split[i][0]); }
			}
			if(nombres) {
				nombres = RFC.CI_AI(nombres);
				split = nombres.split(" ");
				i = 0;
				if(split.length > 1 && RFC.R6.contains(split[i])){ R6 = true; i = 1; indexes[2] += split[i].length + 1  }
				for(;i < split.length - 1 && RFC.A5.contains(split[i]); i++){ R8[2] = true; indexes[2] += split[i].length + 1; }
				if(R4 || R7){
					result = result.replaceAt(2, split[i][0]);
					result = result.replaceAt(3, split[i][1]);
				}
				else{ result = result.replaceAt(3, split[i][0]); }
			}
			else{ homoclave = false; }
			if(RFC.A4.contains(result.slice(0, 4))){ R9 = true; result = result.replaceAt(3, "X"); }
			if(fechaNacimiento){ result = result.replaceAt(4, fechaNacimiento.format("YYMMDD")); }
			if(homoclave){
				var nombre = "{0} {1}{2}".format(apellidoPaterno,apellidoMaterno ? apellidoMaterno + " " : "", nombres);
				nombre = nombre.replaceAll("[.]", "").replaceAll("-", ""). replaceAll("'", "");
				homoclave = 0;
				for(var nombre_i = 0, last = "0", A1; nombre_i < nombre.length; nombre_i++){
					A1 = RFC.A1[nombre[nombre_i]];
					homoclave += (last + A1[0]) * A1[0];
					homoclave += A1 * A1[1];
					last = A1[1];
				}
				homoclave = ("" + homoclave).slice(-3);
				result = result.replaceAt(10, RFC.A2[Math.floor(homoclave / 34)]);
				result = result.replaceAt(11, RFC.A2[homoclave % 34]);
				if(fechaNacimiento){ result = result.replaceAt(12, RFC.dv(result)); }
			}
			return result;
		}
		RFC.dv = function(rfc){
			var dv = 0;
			for (var i = 0, A3; i < 12; i++) { dv += (RFC.A3[rfc[i]] || 0)  * (13 - i); }
			dv = 11 - dv % 11 + "";
			return dv === "11" && "0" || dv === "10" && "A" || dv;
		}
		RFC.test = function(rfc){ return rfc[12] === RFC.dv(rfc); }
		RFC.CI_AI = function (val){
			val = val.toUpperCase();
			for(var repl_i = 0, ci; repl_i < RFC.CI_AI_t.length; repl_i++){
				for(ci = 0; ci < RFC.CI_AI_t[repl_i][0].length; ci++){ val = val.replaceAll(RFC.CI_AI_t[repl_i][0][ci], RFC.CI_AI_t[repl_i][1]); }
			}
			return val;
		}
		RFC.CI_AI_t = [["Á","A"], ["É","E"], ["Í","I"], ["ÓÖ","O"], ["ÚÜ","U"]];
		RFC.voalInterna = function (word){ for(var i = 1; i < word.length; i++){ if(RFC.vocales.contains(word[i])){ return word[i]; } } }
		RFC.vocales = ["A", "E", "I", "O", "U"];
		RFC.R6 = ["MARIA", "JOSE", "MA", "MA."];
		RFC.A1 = {
			" ": "00", 
			"0": "00", "1": "01", "2": "02", "3": "03", "4": "04", "5": "05", "6": "06", "7": "07", "8": "08", "9": "09", 
			"&": "10", "A": "11", "B": "12", "C": "13", "D": "14", "E": "15", "F": "16", "G": "17", "H": "18", "I": "19",
			           "J": "21", "K": "22", "L": "23", "M": "24", "N": "25", "O": "26", "P": "27", "Q": "28", "R": "29",
								  "S": "32", "T": "33", "U": "34", "V": "35", "W": "36", "X": "37", "Y": "38", "Z": "39",
			"Ñ": "40"
		};
		RFC.A2 = {
			 "0": "1",  "1": "2",  "2": "3",  "3": "4",  "4": "5",  "5": "6",  "6": "7",  "7": "8",  "8": "9",  "9": "A",
			"10": "B", "11": "C", "12": "D", "13": "E", "14": "F", "15": "G", "16": "H", "17": "I", "18": "J", "19": "K",
			"20": "L", "21": "M", "22": "N", "23": "P", "24": "Q", "25": "R", "26": "S", "27": "T", "28": "U", "29": "V",
			"30": "W", "31": "X", "32": "Y", "33": "Z"
		}
		RFC.A3 = {
			 "1": 1,  "2": 2,  "3": 3,  "4": 4,  "5": 5,  "6": 6,  "7": 7,  "8": 8,  "9": 9, "A": 10, 
			"B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17, "I": 18, "J": 19, "K": 20, 
			"L": 21, "M": 22, "N": 23, "&": 24, "O": 25, "P": 26, "Q": 27, "R": 28, "S": 29, "T": 30, 
			"U": 31, "V": 32, "W": 33, "X": 34, "Y": 35, "Z": 36, " ": 37, "Ñ": 38
		};
		RFC.A4 = [
			"BUEI", "BUEY", "CACA", "CACO", "CAGA", "CAGO", "CAKA", "CAKO", "COGE", "COJA", "COJE", "COJI", "COJO", "CULO", "FETO", "GUEY", "JOTO", "KACA", 
			"KACO", "KAGA", "KAGO", "KOGE", "KOJO", "KAKA", "KULO", "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MION", "MOCO", "MULA", "PEDA", "PEDO", "PENE", 
			"PUTA", "PUTO", "QULO", "RATA", "RUIN"
		];
		RFC.A5 = ["DE", "LA", "LAS", "MC", "VON", "DEL", "LOS", "Y", "MAC", "VAN", "MI"];
        //Bandas
        database.tables({
            title: ['Bandas', 'Banda', 'tbl_bandas'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Banda ID', identity: true},
                { title: 'Banda', maxlength: 1, str: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
		var movil= /^tel:[+]521\d{10};ext=[45]\d{3}$/;
        //Posiciones
        database.tables({
            title: ['Posiciones', 'Posición', 'tbl_posiciones'],
            insert: true, update: true, delete: true,
			colsdef: [
				"Posición ID", "COMEX ID", "Colaborador", "Colaborador >PPG ID", "Lugar", "Lugar >Empresa", "Lugar >Empresa >Tipo", 
				"Lugar >Municipio >Entidad", "Lugar >Municipio >Entidad >País", 'Lugar >Posición JC >Colaborador', 'Lugar >Posición JC >Email', "Puesto", 
				"Puesto >Nivel", "Centro de costos", "Dirección", "Dirección >Posición BP >Colaborador", "Dirección >Posición BP >Email", "Tipo", 
				"Posición jefe", "Posición jefe >Colaborador", "Posición jefe >Email", "Posición director", "Posición director >Colaborador", "Email", 
				"Email capturado", "Email seguimiento", "Email confirmado","Email confirmado fecha", "Teléfono", "Teléfono móvil", "Banda", "Equipo", 
				"Equipo capturado", "Incapacidad", "Antigüedad", "Alta", "Baja", "Actualizado por", "Fecha actualizado", "Fecha insertado", "Insertado por"
			],
            cols: [
                { title: 'Posición ID', identity: true, str: true },
                { title: 'COMEX ID', minlength: 3, maxlength: 6 },
                { title: 'Colaborador', type: "Int", required: true },
                { title: 'Lugar', type: "Int", required: true, explicacion: "Lugar de trabajo físico"},
                { title: 'Puesto', type: "Int" },
                { title: 'Centro de costos', type: "Int" },
                { title: 'Dirección', type: "Int" },
                { title: 'Tipo', type: "Int" },
                {
                    title: 'Posición jefe', type: "Int", badInput: function (cell_posicion_jefe) {
						var row = cell_posicion_jefe.row;
						var rowjefe = cell_posicion_jefe._val;
                        if (rowjefe === row) { return "La posición del jefe no puede ser la misma posición"; }
						if(rowjefe.val("Lugar >Empresa >Tipo", undefined, "TEXT") !== "Interna COMEX"){ return; }
						if(rowjefe.val("Tipo", undefined, "TEXT") !== "CONFIANZA"){ return; }
						var posjef = rowjefe.val("Puesto >Nivel", undefined, "TEXT");
						if(posjef === "DIRECCION"){return; }
						var poscol = row.val("Puesto >Nivel", undefined, "TEXT");
						if(posjef === "SUBDIRECCION" && !["GERENCIA", "JEFATURA", "COODINACION/SUPERVISION", ""].contains(poscol)){ return "El jefe en nivel {0} no puede tener un colaborador en nivel {1}".format(posjef, poscol); }
						if(posjef === "GERENCIA" && !["GERENCIA", "JEFATURA", "COODINACION/SUPERVISION", ""].contains(poscol)){ return "El jefe en nivel {0} no puede tener un colaborador en nivel {1}".format(posjef, poscol); }
						if(posjef === "JEFATURA" && !["GERENCIA", "JEFATURA", "COODINACION/SUPERVISION", ""].contains(poscol)){ return "El jefe en nivel {0} no puede tener un colaborador en nivel {1}".format(posjef, poscol); }
						if(posjef === "COODINACION/SUPERVISION" && !["GERENCIA", "JEFATURA", "COODINACION/SUPERVISION", ""].contains(poscol)){ return "El jefe en nivel {0} no puede tener un colaborador en nivel {1}".format(posjef, poscol); }
						if(posjef === "" && ![""].contains(poscol)){ return "El jefe en nivel BASE CONFIANZA no puede tener un colaborador en nivel {1}".format(posjef, poscol); }
                    }
                },
				{ 
					title: 'Posición director', type: "Int", badInput: function (cell_posicion_director) { 
                        if (cell_posicion_director._val === cell_posicion_director.row) { return "La posición del director no puede ser la misma posición"; }
                    }
				},
				{ title: 'Email', type: 'Email', maxlength: 100, unique: true, indexMatch: true },
				{ title: 'Email capturado', type: 'Date', min: moment([2008]), max: moment() },
				{ title: 'Email confirmado', type: 'Bool' },
				{ title: 'Email confirmado fecha', type: 'Date', min: moment([2008]), max: moment() },
				{ title: 'Email seguimiento', type: 'Bool', default: true },
                {
					title: 'Teléfono', minlength: 4, maxlength: 50, transform: 'lowercase',
					badInput: function badInput(cell_tel){
						var row = cell_tel.row;
						var tel_tmp = cell_tel._val.replace(/[ .)(-]/g, '');
						if(tel_tmp === ""){ cell_tel._val = null; return; }
						if(tel_tmp.slice(0, 1) === "+"){ tel_tmp = "tel:{0}".format(tel_tmp); }
						if(row.val("Lugar >Municipio >Entidad >País", undefined, "TEXT") === "Mexico"){
							if(tel_tmp.length === 10){ tel_tmp = "tel:+52{0}".format(tel_tmp); }
							if(tel_tmp.length === 12){
								if(tel_tmp.startsWith("01")){ tel_tmp = tel_tmp.replace("01", "52"); }
								if(tel_tmp.startsWith("52")){ tel_tmp = "tel:+{0}".format(tel_tmp); }
							}
							if(tel_tmp.length === 13 && ["044", "045", "521"].contains(tel_tmp.slice(0, 3))){ 
								return "No se acepta número celular";
							}
							if(tel_tmp.startsWith("tel:+")){
								if(tel_tmp.slice(5, 7) !== "52"){ return "Clave internacional no corresponde con méxico"; }
								if(tel_tmp.slice(5, 8) === "521"){ return "No se acepta número celular"; }
							}
						}
						
						var lugar = row.val("Lugar", undefined, "TEXT");
						var tttt = [
							[//0
								[/^tel:[+]5233105729(0[1-9]|[1-9]\d);ext=29\1$/, "29XX"],
								[/^29(?:0[1-9]|[1-9]\d)$/, "tel:+52331057{0};ext={0}"],
								[/^105729(?:0[1-9]|[1-9]\d)$/,"tel:+52331057{0};ext={0}", 4, 4],
								[/^tel:[+]5233105729(?:0[1-9]|[1-9]\d)$/,"tel:+52331057{0};ext={0}", 13, 4]
							],
							[//1
								[/^tel:[+]5242727195(0[1-9]|[1-9]\d);ext=32\1$/, "95XX"],
								[/^(?:32|95)(?:0[1-9]|[1-9]\d)$/, "tel:+5242727195{0};ext=32{0}", 2, 2],
								[/^27195(?:0[1-9]|[1-9]\d)$/, "tel:+5242727195{0};ext=32{0}", 5, 2],
								[/^tel:[+]5242727195(?:0[1-9]|[1-9]\d)$/, "tel:+5242727195{0};ext=32{0}", 15, 2]
							],
							[//2
								[/^tel:[+]5244296281(0[1-9]|[1-9]\d);ext=81\1/, "81XX"],
								[/^81(?:0[1-9]|[1-9]\d)$/, "tel:+52442962{0};ext={0}"],
								[/^96281(?:0[1-9]|[1-9]\d)$/, "tel:+52442962{0};ext={0}", 3, 4],
								[/^tel:[+]5244296281(?:0[1-9]|[1-9]\d)$/, "tel:+52442962{0};ext={0}", 13, 4]
							],
							[//3
								[/^tel:[+]525516691(?:([0-3](?:0[1-9]|[1-9]\d));ext=1\1|000;ext=(?:09|6[02])(?:0[1-9]|[1-9]\d))$/, "09XX, 10XX, 11XX, 12XX, 13XX, 60XX, 62XX"],
								[/^1[0-3](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^(?:09|6[02])(?:0[1-9]|[1-9]\d)$/, "tel:+525516691000;ext={0}"],
								[/^16691[0-3](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]525516691[0-3](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//4
								[/^tel:[+]5255166914(?:(0[1-9]|[1-9]\d);ext=14\1|00;ext=(?:63|75)(?:0[1-9]|[1-9]\d))$/, "14XX, 63XX, 75XX"],//04XX
								[/^14(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^(?:63|75)(?:0[1-9]|[1-9]\d)$/, "tel:+525516691400;ext={0}"],
								[/^166914(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166914(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//5
								[/^tel:[+]5255166915(?:(0[1-9]|[1-9]\d);ext=15|00;ext=01(?:0[1-9]|[1-9]\d))\1$/, "01XX, 15XX"],
								[/^15(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^01(?:0[1-9]|[1-9]\d)$/, "tel:+525516691500;ext={0}"],
								[/^166915(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166915(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//6
								[/^tel:[+]525516691([67](?:0[1-9]|[1-9]\d));ext=1\1$/, "16XX, 17XX"],
								[/^1[67](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^16691[67](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]525516691[67](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//7
								[/^tel:[+]52551669((?:1[89]|27)(?:0[1-9]|[1-9]\d));ext=\1$/, "18XX, 19XX, 27XX"],
								[/^(?:1[89]|27)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^1669(?:1[89]|27)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]52551669(?:1[89]|27)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//8
								[/^tel:[+]5255166920(0[1-9]|[1-9]\d);ext=20\1$/, "20XX"],
								[/^20(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^166920(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166920(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//9
								[/^tel:[+]5255166921(0[1-9]|[1-9]\d);ext=21\1$/, "21XX"],
								[/^21(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^166921(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166921(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//10
								[/^tel:[+]5255166922(0[1-9]|[1-9]\d);ext=22\1$/, "22XX"],
								[/^22(0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^166922(0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext=22{0}", 4, 4],
								[/^tel:[+]5255166922(0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//11
								[/^tel:[+]52551669(?:((?:2[34]|34)(?:0[1-9]|[1-9]\d));ext=\1|3400;ext=78(?:0[1-9]|[1-9]\d))$/, "23XX, 24XX, 34XX, 78XX"],
								[/^(?:2[34]|34)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^78(?:0[1-9]|[1-9]\d)$/, "tel:+525516693400;ext={0}"],
								[/^1669(?:2[34(?:2[34]|34)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]52551669(?:2[34]|34)(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//12
								[/^tel:[+]5255166925(0[1-9]|[1-9]\d);ext=25\1$/, "25XX"],
								[/^25(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^166925(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166925(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//13
								[/^tel:[+]5255166926(0[1-9]|[1-9]\d);ext=26\1?$/, "26XX"],
								[/^26(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^166926(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]5255166926(?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//14
								[/^tel:[+]525516693([78](?:0[1-9]|[1-9]\d));ext=3\1?$/, "37XX, 38XX"],
								[/^3[78](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}"],
								[/^16693[78](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 4, 4],
								[/^tel:[+]525516693[78](?:0[1-9]|[1-9]\d)$/, "tel:+52551669{0};ext={0}", 13, 4]
							],
							[//15
								[/^tel:[+]5255626633(0[1-9]|[1-9]\d);ext=33\1$/, "33XX"],
								[/^33(?:0[1-9]|[1-9]\d)$/, "tel:+52556266{0};ext={0}"],
								[/^626633[78](?:0[1-9]|[1-9]\d)$/, "tel:+52556266{0};ext={0}", 4, 4],
								[/^tel:[+]5255626633[78](?:0[1-9]|[1-9]\d)$/, "tel:+52556266{0};ext={0}", 13, 4]
							],
							[//16
								[/^tel:[+]528111606([89](?:0[1-9]|[1-9]\d));ext=6\1$/, "68XX, 69XX"],
								[/^6[89](?:0[1-9]|[1-9]\d)$/, "tel:+52811160{0};ext={0}"],
								[/^11606[89](?:0[1-9]|[1-9]\d)$/, "tel:+52811160{0};ext={0}", 4, 4],
								[/^tel:[+]528111606[89](?:0[1-9]|[1-9]\d)$/, "tel:+52811160{0};ext={0}", 13, 4]
							],
							[//17
								[/^tel:[+]529222250330;ext=30(?:0[1-9]|[1-9]\d)$/, "30XX"],
								[/^30(?:0[1-9]|[1-9]\d)$/, "tel:+529222250330;ext={0}"]
							],
							[//18
								[/^tel:[+]503252791(0[1-9]|[1-9]\d);ext=91\1$/, "91XX"],
								[/^91(?:0[1-9]|[1-9]\d)$/, "tel:+5032527{0};ext={0}"],
								[/^tel:[+]503252791(?:0[1-9]|[1-9]\d)$/, "tel:+5032527{0};ext=6{0}", 12, 4]
							]
						];
						var lugares = [
							["KROMA GUADALAJARA", tttt[0]],
							["KMZ SJR QUERETARO", tttt[1]],
							["CLRH", tttt[2]],
							["KROMA TULTITLAN", tttt[3]],
							["EXTERNO KROMA TULTITLAN", tttt[3]],
							["GRUPO COMEX TULTITLAN", tttt[3]],
							["TEPEXPAN", tttt[4]],
							["PARCAR", tttt[5]],
							["GRUPO COMEX", tttt[6]],
							["FPU", tttt[7]],
							["GRUPO COMEX TLALNEPANTLA", tttt[7]],
							["AGA", tttt[8]],
							["KROMA STA. MA. LA RIVERA", tttt[9]],
							["EXTERNO STA. MA. LA RIVERA", tttt[9]],
							["KROMA POLANCO", tttt[10]],
							["GRUPO COMEX POLANCO", tttt[10]],
							["EXTERNO POLANCO", tttt[10]],
							["KROMA CUAUTITLAN", tttt[11]],
							["EXTERNO KROMA CUAUTITLAN", tttt[11]],
							["GRUPO COMEX CUAUTITLAN", tttt[11]],
							["CIC TLALNEPANTLA", tttt[12]],
							["PESA", tttt[13]],
							["CLRH DF", tttt[14]],
							["KMZ MEXICO", tttt[14]],
							["KROMA TLALNEPANTLA", tttt[15]],
							["KROMA MONTERREY", tttt[16]],
							["KROMA MINATITLAN", tttt[17]],
							["LATAM SALVADOR", tttt[18]]
						];
						var lugar2;
						for(var i = 0; i < lugares.length; i++){ if(lugares[i][0] === lugar){ lugar2 = lugares[i][1]; break; } }
						if(lugar2){
							for(var i = 0; i < lugar2.length; i++){
								if(lugar2[i][0].test(tel_tmp)){
									cell_tel._val = i === 0 ? tel_tmp : lugar2[i][1].format(tel_tmp.substring(lugar2[i][2]));
									return;
								}
							}
							return  "Utiliza el formato: {0}".format(lugar2[0][1]);
						}
					}
				},
                { 
					title: 'Teléfono móvil', minlength: 6, maxlength: 27, pattern: $.comex.phonemovilext, unique: true, transform: 'lowercase',
					badInput: function(cell_movil){
						var row = cell_movil.row;
						if(row.val("Lugar >Empresa >Tipo", undefined, "TEXT") !== "Interna COMEX"){ return; }
						if(!movil.test(cell_movil._val)){ 
							if(!/^.....521.+$/.test(cell_movil._val)){ return "El número debe iniciar con tel:+521"; }
							return "La extensión debe ser en el rango 4XXX y 5XXX" 
						}
					}
				},
                { title: 'Banda', type: "Int" },
                { title: 'Equipo', minlength: 5, maxlength: 20, unique: true, indexMatch: true, transform: 'uppercase' },
				{ title: 'Equipo capturado', type: 'Date',min: moment([2008]), max: moment() },
				{ title: 'Incapacidad', type: 'Date', min: moment().subtract(6, 'month'), max: moment() },
                { title: 'Antigüedad', type: 'Date', min: moment([1965]), max: moment() },
                {
					title: 'Alta', type: 'Date', min: moment([1965]), max: moment(), required: true, 
					onChange: function (alta, posicion) { posicion.cell("Baja").change("min", alta.val().clone()); }
				},
                { title: 'Baja', type: 'Date', max: moment() },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
        database.tables({
            title: ['Posiciones cambios', 'Posición cambio', 'tblh_posiciones'],
            insert: false, update: false, delete: false,
			colsdef: [
				"ID", "Fecha insertado", "Insertado por", "Posición", "COMEX ID", 'COMEX ID cambio', "Colaborador", 'Colaborador cambio', "Lugar", 
				'Lugar cambio', "Puesto", 'Puesto cambio', "Centro de costos", 'Centro de costos cambio', "Dirección", 
				'Dirección cambio', "Tipo", 'Tipo cambio', "Posición jefe", 'Posición jefe cambio', "Teléfono", 'Teléfono cambio', "Teléfono móvil", 'Teléfono móvil cambio', 
				"Banda", 'Banda cambio', "Alta", 'Alta cambio', "Baja", 'Baja cambio'
			],
            cols: [
                { title: 'ID', identity: true, str: true },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' },
                { title: 'Posición', type: "Int" },
                { title: 'COMEX ID' },
                { title: 'COMEX ID cambio', type: 'Bool' },
                { title: 'Colaborador', type: "Int" },
                { title: 'Colaborador cambio', type: 'Bool' },
                { title: 'Lugar', type: "Int" },
                { title: 'Lugar cambio', type: 'Bool' },
                { title: 'Puesto', type: "Int" },
                { title: 'Puesto cambio', type: 'Bool' },
                { title: 'Centro de costos', type: "Int" },
                { title: 'Centro de costos cambio', type: 'Bool' },
                { title: 'Dirección', type: "Int" },
                { title: 'Dirección cambio', type: 'Bool' },
                { title: 'Tipo', type: "Int" },
                { title: 'Tipo cambio', type: 'Bool' },
                { title: 'Posición jefe', type: "Int" },
                { title: 'Posición jefe cambio', type: 'Bool' },
                { title: 'Teléfono' },
                { title: 'Teléfono cambio', type: 'Bool' },
                { title: 'Teléfono móvil' },
                { title: 'Teléfono móvil cambio', type: 'Bool' },
                { title: 'Banda', type: "Int" },
                { title: 'Banda cambio', type: 'Bool' },
                { title: 'Alta', type: 'Date' },
                { title: 'Alta cambio', type: 'Bool' },
                { title: 'Baja', type: 'Date' },
                { title: 'Baja cambio', type: 'Bool' }
			]
        });
        //Tipos empresa
        database.tables({
            title: ['Tipos empresa', 'Tipo', 'tbl_empresa_tipos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Tipo ID', identity: true },
                { title: 'Tipo', maxlength: 50, str: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
        //Empresas
        database.tables({
            title: ['Empresas', 'Empresa', 'empresas'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Empresa ID', identity: true },
                { title: 'Empresa', required: true, maxlength: 20, transform: 'uppercase', str: true },
                { title: 'COMEX ID', type: "Int", unique: true, min: 100, max: 9999 },
                { title: 'Razón social', maxlength: 100, unique: true, transform: 'uppercase' },
                { title: 'RFC', minlength: 12, maxlength: 13, unique: true, transform: 'uppercase' },
                { title: 'Establecimiento', type: 'Int', unique: true },
                {
                    title: 'Contacto', type: "Int", options: function (colaboradores) {
                        var empresa = this.row;
                        return colaboradores.where(function (colaborador) { return colaborador.rows('Lugar.Empresa') === empresa; });
                    }
                },
                { title: 'STPS Agente capacitador', type: "Int", required: true },
                { title: 'STPS Registro', minlength: 6, maxlength: 20, unique: true, transform: 'uppercase' },
                { title: 'Tipo', type: "Int", required: true, default: database.tables("Tipos empresa").rows(2) },
                { title: 'Página web', type: "url", maxlength: 200, unique: true },
                { title: 'Logo', type: 'Img', readonly: true },
                { title: 'LogoX', type: 'Int', min: 0 },
                { title: 'LogoY', type: 'Int', min: 0 },
                { title: 'Formato de asistencias', type: "Int" },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }
			]
        });
        //Lugares
        database.tables({
            title: ['Lugares', 'Lugar', 'tbl_lugares'],
            insert: true, update: true, delete: true,
			colsdef: [
				'Lugar', 'Otros nombres', 'Teléfono', 'Empresa', 'Empresa >Tipo', 'COMEX ID', 'Dirección', 'Posición JC', 
				'Posición JC >Colaborador', 'Posición JC >Email', 'STPS Clave establecimiento', 'Mascara IP', 'SICC ID', 'Calle', 'No exterior', 
				'No interior', 'Colonia', 'CP', 'Municipio', 'Municipio >Entidad', 'Municipio >Entidad >País', 'Actualizado por', 'Fecha actualizado', 
				'Fecha insertado', 'Insertado por', 'Lugar ID'
			],
            cols: [
                { title: 'Lugar ID', identity: true },
                { title: 'COMEX ID', unique: true, minlength: 6, maxlength: 7, indexMatch: true },
                { title: 'Lugar', maxlength: 40, transform: 'uppercase', str: true },
                { title: 'Otros nombres', transform: 'uppercase' },
                { title: 'Empresa', type: "Int", required: true },
                { title: 'Dirección', maxlength: 200, readonly: true, transform: 'uppercase' },
                { title: 'Teléfono', minlength: 9, maxlength: 27, pattern: $.comex.phone },
                { title: 'Posición JC', type: "Int" },
                { title: 'STPS Clave establecimiento', type: 'Int', min: 1, max: 999999 },
                { title: "Mascara IP", minlength: 3, maxlength: 12, unique: true },
                { title: 'SICC ID', type: 'Int', min: 0, unique:true },
                { title: 'Calle', maxlength: 50, onChange: direccioncompleta, transform: 'uppercase' },
                { title: 'No exterior', maxlength: 10, onChange: direccioncompleta, transform: 'uppercase' },
                { title: 'No interior', maxlength: 20, onChange: direccioncompleta, transform: 'uppercase' },
                { title: 'Colonia', maxlength: 50, onChange: direccioncompleta, transform: 'uppercase' },
                { title: 'CP', type: 'Int', min: 1000, max: 99999, onChange: direccioncompleta },
                { title: 'Municipio', type: "Int", onChange: direccioncompleta, explicacion: "Delegación o municipio" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
		
		
		
        //Inscripciones RED
        database.tables({
            title: ['Inscripciones RED', 'Inscripción', 'comex_enrolments'],
            insert: false, update: true, delete: false,
			colsdef: [
				"Fecha corte", "Alumno", "Alumno >PPG ID", "Alumno >Posición >Lugar", "Alumno >Posición >Lugar >Empresa", 
				"Alumno >Posición >Lugar >Municipio >Entidad", "Alumno >Posición >CC", "Alumno >Posición >Puesto", 
				"Alumno >Posición >Puesto >Nivel", "Alumno >Posición >Dirección", 
				"Alumno >Posición >Dirección >Posición BP >Colaborador >Nombre corto", 
				"Alumno >Posición >Posición jefe >Colaborador >Nombre corto", "Alumno >Posición >Posición jefe >Email", 
				"Alumno >Posición >Email", "Fecha insertado", "Inscripción ID"
			],
            cols: [
                { title: 'Inscripción ID', identity: true, str: true },
                { title: 'Alumno', type: "Int", readonly: true },
                { title: 'Curso', type: "Int", readonly: true },
                { title: 'Estado', type: "Int", readonly: true },
                { title: 'Progreso', type: "Int", readonly: true },
                { title: 'Nota inicial', type: "Int", readonly: true },
                { title: 'Nota final', type: "Int", readonly: true },
                { title: 'Fecha inicio', type: 'Date' },
                { title: 'Fecha fin', type: 'Date' },
                { title: 'Fecha progreso', type: 'Datetime', readonly: true },
                { title: 'Solicitante', type: "Int", readonly: true },
                { title: 'Inscripciones', type: "Int", readonly: true },
                { title: 'Activo', type: "Bool", readonly: true },
                { title: 'Fecha corte', type: 'Datetime', readonly: true },
                { title: 'Insertó', type: 'Int', readonly: true },
                { title: 'Fecha insertado' }
			]
        });
		
		
		
		
        function direccioncompleta(cell) {
            var lugar = cell.row;
            var parts = [];
            parts.push(lugar.cell('Calle').val(undefined, "TEXT"));
            parts.push(lugar.cell('No exterior').val(undefined, "TEXT"));
            if (lugar.cell('No interior').isVal()) { parts.push("Int. {0}".format(lugar.cell('No interior'))); }
            parts.push(lugar.cell('Colonia').val(undefined, "TEXT"));
            if (lugar.cell('CP').isVal()) { parts.push("CP {0}".format("00000{0}".format(lugar.cell('CP')).slice(-5))); }
            if (lugar.cell('Municipio').isVal()) {
                parts.push(lugar.cell('Municipio >Nombre').val(undefined, "TEXT") + ",");
                parts.push(lugar.cell('Municipio >Entidad >Abreviatura').val(undefined, "TEXT"));
            }
            lugar.cell('Dirección').val(parts.join(" "));
        }
        //Salas
        database.tables({
            title: ['Salas', 'Sala', 'salas'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Sala ID', identity: true },
                { title: 'Sala', str: true, readonly: true },
                { title: 'Lugar', type: "Int", required: true },
                { title: 'Nombre', required: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }],
            indexes: [['Lugar', 'Nombre']]
        });
        //Costos
        database.tables({
            title: ['Costos', 'Costo', 'costos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Costo ID', identity: true, str: true },
                { title: 'Capacitación', type: "Int", required: true },
                { title: 'Costo', type: 'Currency', required: true, min: currency.parse(0), max: currency.parse(99999999) },
                { title: 'Rubro', type: "Int", required: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }],
            indexes: [['Capacitación', 'Rubro']]
        });
        //Observaciones
        database.tables({
            title: ['Observaciones', 'Observación', 'observaciones'],
            colsdef: ["Observacion ID", "Observación", "Capacitación", "Capacitación >Curso", "Capacitación >Fecha inicio", "Fecha insertado", "Sesión >Colaborador"],
            insert: true, update: false, delete: true,
            cols: [
                { title: 'Observacion ID', identity: true, str: true },
                { title: 'Observación', type: 'Textarea', required: true },
                { title: 'Capacitación', type: "Int", required: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Puestos
        database.tables({
            title: ['Puestos', 'Puesto', 'tbl_puestos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Puesto ID', identity: true },
                { title: 'Puesto', readonly: true, str: true },
                { title: 'Nombre', maxlength: 80, required: true, transform: 'uppercase' },
                { title: 'Comex ID', maxlength: 5, unique: true, transform: 'uppercase', indexMatch: true },
                { title: 'Nivel', type: "Int" },
                { title: 'STPS Ocupación', type: "Int" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Centros de costos
        database.tables({
            title: ['Centros de costos', 'Centro de costos', 'centrosdecostos'],
            insert: true, update: true, delete: false,
            cols: [
                { title: 'Centro de costos ID', type: 'Int', pk: true, min:8000, max:639999 },
                { title: 'Centro de costos', readonly: true, str: true },
                { title: 'Nombre', maxlength: 70, required: true, transform: 'uppercase' },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }
			]
        });

        //Categorías
        database.tables({
            title: ['Categorías', 'Categoría', 'categorias'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Categoria ID', identity: true },
                { title: 'Categoría', str: true },
                { title: 'Descripción' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Drecciones
        database.tables({
            title: ['Direcciones', 'Dirección', 'tbl_direcciones'],
            insert: true, update: true, delete: true,
			colsdef: [
				"Dirección ID", "Dirección", "Posición BP", "Posición BP >Colaborador", "Fecha actualizado", "Actualizado por", "Fecha insertado", 
				"Insertado por"
			],
            cols: [
                { title: 'Dirección ID', identity: true },
                { title: 'Dirección', str: true },
				{ title: 'Posición BP', type: "Int" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
			]
        });
        //Colaborador estados
        database.tables({
            title: ['Colaborador estados', 'Colaborador estado', 'empleadoestados'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Colaborador estado ID', identity: true },
                { title: 'Colaborador estado', str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }
			]
        });
        //Niveles
        database.tables({
            title: ['Niveles', 'Nivel', 'tbl_users_niveles'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Nivel ID', identity: true },
                { title: 'Nivel', str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Colaborador tipos
        database.tables({
            title: ['Colaborador tipos', 'Colaborador tipo', 'empleadotipos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Colaborador tipo ID', identity: true },
                { title: 'Colaborador tipo', str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Cursos documentos academicos
        database.tables({
            title: ['Cursos documentos academicos', 'Documento académico', 'cursodocumentosacademicos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Documento académico ID', identity: true },
                { title: 'Documento académico', str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Normas
        database.tables({
            title: ['Normas', 'Norma', 'normas'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Norma ID', identity: true },
                { title: 'Norma', str: true },
                { title: 'Descripción' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Sexos
        database.tables({
            title: ['Sexos', 'Sexo', 'sexos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Sexo ID', identity: true },
                { title: 'Sexo', str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Inscripción Estados
        database.tables({
            title: ['Inscripción estados', 'Inscripción estado', 'inscripcionestados'],
            insert: false, update: true, delete: false,
            cols: [
                { title: 'Estado ID', identity: true },
                { title: 'Estado', str: true, transform: 'uppercase', },
                { title: 'Descripción', type: 'Textarea', maxlength: 200 },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }]
        });
        //Rubros
        database.tables({
            title: ['Rubros', 'Rubro', 'rubros'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Rubro ID', identity: true },
                { title: 'Rubro', maxlength: 50, str: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Formatos PDF
        database.tables({
            title: ['Formatos PDF', 'Formato PDF', 'formatospdf'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Formato PDF ID', identity: true },
                { title: 'Nombre corto', maxlength: 50, str: true },
                { title: 'Código formato', type: 'Javascript', required: true },
                { title: 'Código relleno', type: 'Javascript' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });


        //STPS Agentes capacitador
        database.tables({
            title: ['STPS Agentes capacitador', 'STPS Agente capacitador', 'tiposagente'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Agente capacitador ID', identity: true },
                { title: 'STPS Agente capacitador', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Áreas temáticas
        database.tables({
            title: ['STPS Áreas temáticas', 'STPS Área temática', 'areastematicas'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Areatematica ID', identity: true },
                { title: 'STPS Área temática', str: true },
                { title: 'Nombre' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Discapacidades
        database.tables({
            title: ['STPS Discapacidades', 'STPS Discapacidad', 'discapacidades'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Discapacidad ID', identity: true },
                { title: 'STPS Discapacidad', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Documentos academicos
        database.tables({
            title: ['STPS Documentos academicos', 'STPS Documento académico', 'documentosacademicos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Documento académico ID', identity: true },
                { title: 'STPS Documento académico', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Paises
        database.tables({
            //https://www.iso.org/obp/ui/#search
            title: ['Paises', 'País', 'countries'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'País ID', identity: true },
                { title: 'País', str: true, maxlength: 50 },
                { title: 'ISO 3166-1 alpha-2', unique: true, minlength: 2, maxlength: 2, indexMatch: true, transform: 'uppercase' },
                { title: 'ISO 3166-1 alpha-3', unique: true, minlength: 3, maxlength: 3, indexMatch: true, transform: 'uppercase' },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Entidades
        database.tables({
            title: ['Entidades', 'Entidad', 'entidades'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Entidad ID', identity: true },
                { title: 'Entidad', str: true, readonly: true },
                { title: 'Nombre', maxlength: 50, required: true },
                { title: 'País', type: 'Int', required: true },
                { title: 'Abreviatura', unique: true, maxlength: 5 },
                { title: 'Código', unique: true, minlength: 2, maxlength: 2 },
                { title: 'STPS ID', type: "Int", min: 1, unique: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }],
            indexes: [['País', 'Nombre']]
        });
        //Municipios
        database.tables({
            title: ['Municipios', 'Municipio', 'municipios'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Municipio ID', identity: true },
                { title: 'Municipio', str: true, readonly: true },
                { title: 'Nombre', maxlength: 50, required: true },
                { title: 'Entidad', type: "Int", required: true },
                { title: 'STPSID', type: "Int", min: 1 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }],
            indexes: [['Entidad', 'Nombre']]
        });
        //STPS Instituciones
        database.tables({
            title: ['STPS Instituciones', 'STPS Institución', 'instituciones'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Institución ID', identity: true },
                { title: 'STPS Institución', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Niveles academicos
        database.tables({
            title: ['STPS Niveles academicos', 'STPS Nivel académico', 'nivelesacademicos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Nivel académico ID', identity: true },
                { title: 'STPS Nivel académico', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Ocupaciones
        database.tables({
            title: ['STPS Ocupaciones', 'STPS Ocupación', 'ocupaciones'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Ocupación ID', identity: true },
                { title: 'STPS Ocupación', str: true, readonly: true },
                { title: 'Clave', type: 'Int', unique: true },
                { title: 'Nombre', max: 200, required: true, unique: true },
                { title: 'Área', type: 'Int' },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Objetivos
        database.tables({
            title: ['STPS Objetivos', 'STPS Objetivo', 'objetivos'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'STPS Objetivo ID', identity: true },
                { title: 'STPS Objetivo', str: true },
                { title: 'Nombre', unique: true },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //STPS Áreas
        database.tables({
            title: ['STPS Áreas ocupación', 'STPS Área ocupación', 'stpsareas'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Área ID', identity: true },
                { title: 'Área', str: true, readonly: true },
                { title: 'Clave', type: 'Dec', unique: true, step: 0.1, min: 1, max: 11.3 },
                { title: 'Nombre', max: 200, unique: true, required: true },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }]
        });

        //KPI's
        database.tables({
            title: ["KPI's", "KPI", 'kpis'],
            insert: true, update: true, delete: false,
            cols: [
                { title: 'KPI ID', identity: true },
                { title: 'KPI', str: true },
                { title: 'Descripción', type: 'Textarea', maxlength: 1000 },
                { title: 'Fecha actualizado' },
                { title: 'Sesión actualizado' },
                { title: 'Fecha insertado' },
                { title: 'Sesión insertado' }]
        });

        //KPI's 2014
        database.tables({
            title: ["KPI's 2014", 'KPI 2014', 'kpis2014'],
            insert: false, update: false, delete: false,
            colsdef: ["KPI", "KPI >Descripción", "Alumno -Lugar -Empresa", "Alumno -Dirección", "Alumno -Tipo colaborador", "ENERO", "FEBRERO", "MARZO", "ABRIL"
                , "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "2014"],
            cols: [
                { title: 'KPI', type: 'Int' },
                { title: 'Alumno -Lugar -Empresa', type: 'Int' },
                { title: 'Alumno -Dirección', type: 'Int' },
                { title: 'Alumno -Tipo colaborador', type: 'Int' },
                { title: 'ENERO', type: 'Int' },
                { title: 'FEBRERO', type: 'Int' },
                { title: 'MARZO', type: 'Int' },
                { title: 'ABRIL', type: 'Int' },
                { title: 'MAYO', type: 'Int' },
                { title: 'JUNIO', type: 'Int' },
                { title: 'JULIO', type: 'Int' },
                { title: 'AGOSTO', type: 'Int' },
                { title: 'SEPTIEMBRE', type: 'Int' },
                { title: 'OCTUBRE', type: 'Int' },
                { title: 'NOVIEMBRE', type: 'Int' },
                { title: 'DICIEMBRE', type: 'Int' },
                { title: '2014', type: 'Int' }
            ]
        });

        //KPI's 2015
        database.tables({
            title: ["KPI's 2015", 'KPI 2015', 'kpis2015'],
            insert: false, update: false, delete: false,
            colsdef: ["KPI", "KPI >Descripción", "Alumno -Lugar -Empresa", "Alumno -Dirección", "Alumno -Tipo colaborador", "ENERO", "FEBRERO", "MARZO", "ABRIL"
                , "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "2015"],
            cols: [
                { title: 'KPI', type: 'Int' },
                { title: 'Alumno -Lugar -Empresa', type: 'Int' },
                { title: 'Alumno -Dirección', type: 'Int' },
                { title: 'Alumno -Tipo colaborador', type: 'Int' },
                { title: 'ENERO', type: 'Int' },
                { title: 'FEBRERO', type: 'Int' },
                { title: 'MARZO', type: 'Int' },
                { title: 'ABRIL', type: 'Int' },
                { title: 'MAYO', type: 'Int' },
                { title: 'JUNIO', type: 'Int' },
                { title: 'JULIO', type: 'Int' },
                { title: 'AGOSTO', type: 'Int' },
                { title: 'SEPTIEMBRE', type: 'Int' },
                { title: 'OCTUBRE', type: 'Int' },
                { title: 'NOVIEMBRE', type: 'Int' },
                { title: 'DICIEMBRE', type: 'Int' },
                { title: '2015', type: 'Int' }
            ]
        });

        //KPI's capacitaciones
        database.tables({
            title: ["KPI's capacitaciones", "KPI's capacitación", 'kpiscapacitaciones'],
            insert: false, update: false, delete: false,
            colsdef: ["KPI", "Capacitación", "Capacitación >Curso", "Alumno -Dirección", "Resultado"],
            cols: [
                { title: 'KPI', type: 'Int' },
                { title: 'Capacitación', type: 'Int' },
                { title: 'Alumno -Dirección', type: 'Int' },
                { title: 'Resultado', type: 'Int' }
            ]
        });

        //Cuentas
        database.tables({
            title: ['Cuentas', 'Cuenta', 'cuentas'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Cuenta ID', identity: true, str: true },
                { title: 'Colaborador', type: "Int", unique: true, required: true, readonly: function () { return this.val() !== null; } },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }]
        });
        //Permisos
        database.tables({
            title: ['Permisos', 'Permiso', 'permisos'],
            insert: true, update: true, delete: true,
            cols: [
                { title: 'Permiso ID', identity: true, str: true },
                { title: 'Cuenta', type: "Int", readonly: function () { return this.val() !== null; } },
                {
                    title: 'Empresa',
                    type: "Int",
                    readonly: function () { return this.val() !== null; },
                    required: true,
                    coloptions: function (empresas) { return empresas.where(function (empresa) { return [1, 5].contains(empresa.cell('Tipo').val()); }); }
                },
                { title: 'Fecha insertado' },
                { title: 'Sesión' }],
            indexes: [['Cuenta', 'Empresa']]
        });
        //Sesiones
        database.tables({
            title: ['Sesiones', 'Sesión', 'sesiones'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Sesión ID', identity: true, str: true },
                { title: 'Colaborador', type: "Int" },
                { title: 'Fecha insertado' }
            ]
        });
        //Sesion
        database.tables({
            title: ['Sesión', 'Sesión', 'sesion'],
            insert: false, update: false, delete: false,
            cols: [
                { title: 'Sesión', type: 'Int', str: true, pk: true }
            ]
        });


        //Problema estados
        database.tables({
            title: ["Problema estados", "Problema estado", "issues_status"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Estado ID", identity: true },
                { title: "Estado", str: true, maxlength: 50, transform: 'uppercase' },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });

        //Problema versiones
        database.tables({
            title: ["Problema versiones", "Problema versión", "issue_versions"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Problema versión ID", identity: true },
                { title: "Problema versión", type: "Dec", min: 1, max: 99.99, step: 0.01, str: true },
                { title: "Beta", type: "Bool" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });

        //Problemas
        database.tables({
            title: ["Problemas", "Problema", "issues"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Problema ID", identity: true },
                { title: "Problema", str: true, readonly: true },
                { title: "Nombre", maxlength: 100, required: true, unique: true, transform: 'uppercase' },
                { title: "Estado", type: "Int", required: true, default: database.tables("Problema estados").rows(1) },
                { title: "Versión detectado", type: "Int", required: true },
                {
                    title: "Fecha detectado", type: "Datetime", required: true, default: "now", min: moment([2008]), max: moment().endOf("day")
                    , onChange: function (fechadetectado, problema) {
                        if (fechadetectado.isVal()) {
                            problema.cell("Fecha corregido").min = fechadetectado.val();
                        } else { delete problema.cell("Fecha corregido").min; }
                        problema.cell("Fecha corregido").reeval();
                    }
                },
                { title: "Versión corregido", type: "Int" },
                { title: "Fecha corregido", type: "Datetime", min: moment([2008]), max: moment().endOf("day") },
                { title: "Descripción", type: "Textarea", maxlength: 4000, requried: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });

        //Problema suscricpciones
        database.tables({
            title: ["Problema suscricpciones", "Problema suscricpción", "issue_suscriptions"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Suscricpción ID", identity: true },
                { title: "Problema", type: "Int", readonly: true },
                { title: "Colaborador", type: "Int", required: true },
                { title: "Fecha", type: "Datetime", required: true, min: moment([2008]), max: moment().endOf("day"), default: "now" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ],
            indexes: [['Problema', 'Colaborador']]
        });
        //Problema comentarios
        database.tables({
            title: ["Problema comentarios", "Problema comentario", "issue_comments"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Comentario ID", identity: true },
                { title: "Problema", type: "Int", required: true },
                { title: "Comentario", type: "Textarea", maxlength: 4000, requried: true },
                { title: "Colaborador", type: "Int", required: true },
                { title: "Fecha", type: "Datetime", required: true, min: moment([2008]), max: moment().endOf("day"), default: "now" },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Problema tiempos
        database.tables({
            title: ["Problema tiempos", "Problema tiempo", "issue_durations"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Tiempo ID", identity: true },
                { title: "Problema", type: "Int", required: true },
                {
                    title: "Fecha inicio", type: "Datetime", required: true, min: moment([2008]), max: moment().endOf("day"), default: "now"
                     , onChange: function (fechainicio, tiempo) {
                         if (fechainicio.isVal()) { tiempo.cell("Fecha fin").min = fechainicio.val(); } else { delete tiempo.cell("Fecha fin").min; }
                         tiempo.cell("Fecha fin").reeval();
                     }
                },
                {
                    title: "Fecha fin", type: "Datetime", min: moment([2008]), max: moment().endOf("day"), onChange: function (fechafin, tiempo) {
                        var fechainicio = +tiempo.cell("Fecha inicio");
                        if (fechainicio && (fechafin = +fechafin)) {
                            tiempo.cell("Horas hombre").val(moment.duration(fechafin - fechainicio));
                        } else { tiempo.cell("Horas hombre").val(null); }
                    }
                },
                { title: "Colaborador", type: "Int", required: true },
                { title: 'Horas hombre', type: 'Duration', min: moment.duration(1000) },
                { title: 'Tiempo extra', type: 'Duration', min: moment.duration(1000) },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Excepciones
        database.tables({
            title: ["Excepciones", "Excepción", "exceptions"],
            insert: true, update: true, delete: true,
            colsdef: ["Excepción ID", "Colaborador", "Colaborador >COMEX ID", "Colaborador >Lugar", "Colaborador >Puesto"
                , "Solicitado por", "Motivo", "Fecha solicitud", "Insertado por"],
            cols: [
                { title: "Excepción ID", identity: true, str: true },
                { title: "Colaborador", type: "Int", required: true, unique: true },
                { title: "Solicitado por", type: "Int", required: true },
                { title: "Motivo", maxlength: 200, required: true },
                { title: "Fecha solicitud", type: "Date", required: true, min: moment([2015]), max: moment(), default: moment() },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Grupos
        database.tables({
            title: ["Grupos", "Grupo", "grupos"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Grupo ID", identity: true },
                { title: "Grupo", str: true, maxlength: 50 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Grupo miembros
        database.tables({
            title: ["Grupo miembros", "Grupo miembro", "groupmembers"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Grupo miembro ID", identity: true, str: true },
                { title: "Colaborador", type: "Int", required: true },
                { title: "Grupo", type: "Int", required: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ],
            indexes: [['Grupo', 'Colaborador']]
        });
        //Temas
        database.tables({
            title: ["PPG Temas", "Tema", "ppgtemas"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Tema ID", identity: true },
                { title: "Tema", maxlength: 50, str: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });


        //Competencias
        database.tables({
            title: ["Competencias", "Competencia", "competencias"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Competencia ID", identity: true },
                { title: "Competencia", maxlength: 50, str: true },
                { title: "Tema", type: "Int", required: true },
                { title: "Descripción", type: "Textarea", maxlength: 400 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Comportamientos
        database.tables({
            title: ["Comportamientos", "Comportamiento", "comportamientos"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Comportamiento ID", identity: true, str: true },
                { title: "Comportamiento", maxlength: 100, required: true },
                { title: "Competencia", type: "Int", required: true },
                { title: "Descripción", type: "Textarea", maxlength: 400 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ],
            indexes: [['Competencia', 'Comportamiento']]
        });
        //Relaciones
        database.tables({
            title: ["Relaciones", "Relación", "relaciones"],
            insert: true, update: true, delete: true,
            colsdef: ["Relación ID", "Comportamiento", "Curso", "Cubre al 100", "Comportamiento >Competencia >Competencia", "Comportamiento >Competencia", "Curso >Proveedor"],
            cols: [
                { title: "Relación ID", identity: true, str: true },
                { title: "Comportamiento", type: "Int", required: true },
                { title: "Curso", type: "Int", required: true },
                { title: "Cubre al 100", type: "Bool", default: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ],
            indexes: [['Comportamiento', 'Curso']]
        });
        //Cursos e-learning
        database.tables({
            title: ["Cursos e-learning", "Curso", "cursoscae"],
            cols: [
                { title: "Curso ID", identity: true },
                { title: "Curso", str: true, readonly: true },
                { title: "Categoría" },
                { title: "Proveedor" },
                { title: "Descripción", type: "Textarea" }
            ]
        });
        database.relations(database.tables('PPG Temas').cols("PK"), database.tables('Competencias').cols('Tema'), true);
        database.relations(database.tables('Competencias').cols("PK"), database.tables('Comportamientos').cols('Competencia'), true);
        database.relations(database.tables('Comportamientos').cols("PK"), database.tables('Relaciones').cols('Comportamiento'), true);
        database.relations(database.tables('Cursos e-learning').cols("PK"), database.tables('Relaciones').cols('Curso'), true);



        //Softwares
        database.tables({
            title: ["Software", "Software", "software"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Software ID", identity: true },
                { title: "Software", maxlength: 50, str: true },
                { title: "Home page", type: "url", maxlength: 100 },
                { title: "Justificación", type: "Textarea", maxlength: 300 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
        //Instalaciones
        database.tables({
            title: ["Instalaciones", "Instalación", "instalaciones"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Instalación ID", identity: true, str: true },
                { title: "Software", type: "Int", required: true },
                { title: "Colaborador", type: "Int", required: true },
                { title: "Licencia", maxlength: 100 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ],
            indexes: [['Software', 'Colaborador']]
        });
        database.relations(database.tables('Software').cols("PK"), database.tables('Instalaciones').cols('Software'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Instalaciones').cols('Colaborador'), true);


        //CAE Tickets
        database.tables({
            title: ["Tickets", "Ticket", "tickets"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "Ticket ID", identity: true },
                { title: "Nombre", maxlength: 100, str: true },
                { title: "CAE ID", maxlength: 50 },
                { title: "Fecha abierto", type: "Datetime", max: moment() },
                { title: "Fecha avance", type: "Datetime", max: moment() },
                { title: "Descripción", type: "Textarea", maxlength: 300 },
                { title: "Estado actual", type: "Textarea", maxlength: 300 },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });
		
        //tbl_tf
        database.tables({
            title: ["TFs", "TF", "tbl_tfs"],
            insert: true, update: true, delete: true,
            cols: [
                { title: "TF ID", type: 'Int', pk: true, min:0, max:1 },
                { title: "TF", maxlength: 1, str: true },
                { title: 'Fecha actualizado' },
                { title: 'Actualizado por' },
                { title: 'Fecha insertado' },
                { title: 'Insertado por' }
            ]
        });



        database.relations(database.tables('Grupos').cols("PK"), database.tables('Grupo miembros').cols('Grupo'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Grupo miembros').cols('Colaborador'), true);


        function estado(row_asistencia) {
            var now, asistencia, final, inicio, return_value;
            if (row_asistencia._working) { return row_asistencia; }
            row_asistencia._working = true;
            now = +moment();
            if (row_asistencia.cell("Programación >Fecha fin") <= now) {
                if ((asistencia = +row_asistencia.cell("Asistencia"))) {
                    if (asistencia >= row_asistencia.cell("Programación >Capacitación >Asistencia mínima")) {
                        if ((final = +row_asistencia.cell("Calificación final"))) {
                            if (final >= row_asistencia.cell("Programación >Capacitación >Calificación mínima")) {
                                return_value = estado.aprobado;
                            } else { return_value = estado.reprobado; }
                        } else if (+row_asistencia.cell("Programación >Con calificación final")) {
                            return_value = estado.nopresento;
                        } else { return_value = estado.completado; }
                    } else { return_value = estado.nocompleto; }
                } else { return_value = estado.noasistio; }
            } else if ((inicio = +row_asistencia.cell("Programación >Fecha inicio"))) {
                if (inicio <= now) {
                    if (+row_asistencia.cell("Asistencia")) {
                        return_value = estado.cursando;
                    } else { return_value = estado.sinasistencia; }
                } else { return_value = estado.programado; }
            } else { return_value = null; }
            row_asistencia.cell("Estado").val(return_value);
            delete row_asistencia._working;
            return row_asistencia;
        }
        estado.aprobado = database.tables("Inscripción estados").rows(1);
        estado.completado = database.tables("Inscripción estados").rows(2);
        estado.reprobado = database.tables("Inscripción estados").rows(4);
        estado.nopresento = database.tables("Inscripción estados").rows(5);
        estado.nocompleto = database.tables("Inscripción estados").rows(6);
        estado.noasistio = database.tables("Inscripción estados").rows(7);
        estado.cursando = database.tables("Inscripción estados").rows(8);
        estado.sinasistencia = database.tables("Inscripción estados").rows(9);
        estado.programado = database.tables("Inscripción estados").rows(10);
		
		//inscripciones RED
        database.relations(database.tables('Colaboradores').cols("CAE ID"), database.tables('Inscripciones RED').cols('Alumno'));
        database.relations(database.tables('Colaboradores').cols("CAE ID"), database.tables('Inscripciones RED').cols('Solicitante'));
        database.relations(database.tables('Colaboradores').cols("CAE ID"), database.tables('Inscripciones RED').cols('Insertó'));

        database.relations(database.tables('Lugares').cols("PK"), database.tables('Posiciones').cols('Lugar'), true);
        database.relations(database.tables('Puestos').cols("PK"), database.tables('Posiciones').cols('Puesto'), true);
        database.relations(database.tables('Centros de costos').cols("PK"), database.tables('Posiciones').cols('Centro de costos'), true);
        database.relations(database.tables('Direcciones').cols("PK"), database.tables('Posiciones').cols('Dirección'), true);
        database.relations(database.tables('Colaborador tipos').cols("PK"), database.tables('Posiciones').cols('Tipo'), true);
        database.relations(database.tables('Posiciones').cols("PK"), database.tables('Posiciones').cols('Posición jefe'), true);
        database.relations(database.tables('Posiciones').cols("PK"), database.tables('Posiciones').cols('Posición director'), true);
        database.relations(database.tables('Bandas').cols("PK"), database.tables('Posiciones').cols('Banda'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Posiciones').cols('Colaborador'), true);
		
		database.relations(database.tables('Posiciones').cols("PK"), database.tables('Direcciones').cols('Posición BP'), true);
		
		//Colaboradores
        database.relations(database.tables('Posiciones').cols("PK"), database.tables('Colaboradores').cols('Posición'), true);
        database.relations(database.tables('Sexos').cols("PK"), database.tables('Colaboradores').cols('Sexo'));
		
        database.relations(database.tables('Niveles').cols("PK"), database.tables('Puestos').cols('Nivel'), true);
        database.relations(database.tables('STPS Ocupaciones').cols("PK"), database.tables('Puestos').cols('STPS Ocupación'));
		
        database.relations(database.tables('Posiciones').cols("PK"), database.tables('Lugares').cols('Posición JC'));
        database.relations(database.tables('Empresas').cols("PK"), database.tables('Lugares').cols('Empresa'), true);
        database.relations(database.tables('Municipios').cols("PK"), database.tables('Lugares').cols('Municipio'));
		
		
		database.relations(database.tables('Posiciones').cols("PK"), database.tables('Posiciones cambios').cols('Posición'), true);
        database.relations(database.tables('Lugares').cols("PK"), database.tables('Posiciones cambios').cols('Lugar'), true);
        database.relations(database.tables('Puestos').cols("PK"), database.tables('Posiciones cambios').cols('Puesto'), true);
        database.relations(database.tables('Centros de costos').cols("PK"), database.tables('Posiciones cambios').cols('Centro de costos'), true);
        database.relations(database.tables('Direcciones').cols("PK"), database.tables('Posiciones cambios').cols('Dirección'), true);
        database.relations(database.tables('Colaborador tipos').cols("PK"), database.tables('Posiciones cambios').cols('Tipo'), true);
        database.relations(database.tables('Posiciones').cols("PK"), database.tables('Posiciones cambios').cols('Posición jefe'), true);
        database.relations(database.tables('Bandas').cols("PK"), database.tables('Posiciones cambios').cols('Banda'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Posiciones cambios').cols('Colaborador'), true);

        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Excepciones').cols('Colaborador'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Excepciones').cols('Solicitado por'), true);

        database.relations(database.tables('Problema estados').cols("PK"), database.tables('Problemas').cols('Estado'), true);
        database.relations(database.tables('Problema versiones').cols("PK"), database.tables('Problemas').cols('Versión detectado'), true);
        database.relations(database.tables('Problema versiones').cols("PK"), database.tables('Problemas').cols('Versión corregido'), true);
        database.relations(database.tables('Problemas').cols("PK"), database.tables('Problema suscricpciones').cols('Problema'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Problema suscricpciones').cols('Colaborador'), true);

        database.relations(database.tables('Problemas').cols("PK"), database.tables('Problema comentarios').cols('Problema'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Problema comentarios').cols('Colaborador'), true);

        database.relations(database.tables('Problemas').cols("PK"), database.tables('Problema tiempos').cols('Problema'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Problema tiempos').cols('Colaborador'), true);

        database.relations(database.tables('Paises').cols("PK"), database.tables('Entidades').cols('País'));
        database.relations(database.tables('Entidades').cols("PK"), database.tables('Municipios').cols('Entidad'));

        database.relations(database.tables('Cursos').cols("PK"), database.tables('Capacitaciones').cols('Curso'), true);
        database.relations(database.tables('Cursos').cols("PK"), database.tables('Modulos').cols('Curso'), true);
        database.relations(database.tables('Cursos documentos academicos').cols("PK"), database.tables('Cursos').cols('Documento académico'));
        database.relations(database.tables('Capacitaciones').cols("PK"), database.tables('Programaciones').cols('Capacitación'), true);
        database.relations(database.tables('Capacitaciones').cols("PK"), database.tables('Inscripciones').cols('Capacitación'), true);
        database.relations(database.tables('Capacitaciones').cols("PK"), database.tables('Costos').cols('Capacitación'), true);
        database.relations(database.tables('Capacitaciones').cols("PK"), database.tables('Observaciones').cols('Capacitación'), true);
        database.relations(database.tables('Categorías').cols("PK"), database.tables('Cursos').cols('Categoría'));
        database.relations(database.tables('Rubros').cols("PK"), database.tables('Costos').cols('Rubro'));
        database.relations(database.tables('Cuentas').cols("PK"), database.tables('Permisos').cols('Cuenta'), true);
        database.relations(database.tables('Lugares').cols("PK"), database.tables('Salas').cols('Lugar'), true);
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Capacitaciones').cols('Coordinador'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Capacitaciones').cols('Solicitante'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Cuentas').cols('Colaborador'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Empresas').cols('Contacto'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Inscripciones').cols('Alumno'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Inscripciones').cols('Representante legal'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Inscripciones').cols('Representante trabajador'));
        database.relations(database.tables('Colaboradores').cols("PK"), database.tables('Temas').cols('Instructor'));
        database.relations(database.tables('Curso estados').cols("PK"), database.tables('Cursos').cols('Estado'));
        database.relations(database.tables('Empresas').cols("PK"), database.tables('Permisos').cols('Empresa'));
        database.relations(database.tables('Formatos PDF').cols("PK"), database.tables('Empresas').cols('Formato de asistencias'));
        database.relations(database.tables('Inscripciones').cols("PK"), database.tables('Asistencias').cols('Inscripción'), true);
        database.relations(database.tables('Inscripción estados').cols("PK"), database.tables('Asistencias').cols('Estado'));
        database.relations(database.tables('Inscripción estados').cols("PK"), database.tables('Capacitaciones').cols('Estado'));
        database.relations(database.tables('Inscripción estados').cols("PK"), database.tables('Inscripciones').cols('Estado'));
        database.relations(database.tables('Inscripción estados').cols("PK"), database.tables('Programaciones').cols('Estado'));
        database.relations(database.tables('Lugares').cols("PK"), database.tables('Capacitaciones').cols("Lugar"));
        database.relations(database.tables('Lugares').cols("PK"), database.tables('Empresas').cols("Establecimiento"));
        database.relations(database.tables('Normas').cols("PK"), database.tables('Cursos').cols('Norma'));
        database.relations(database.tables('Programaciones').cols("PK"), database.tables('Asistencias').cols('Programación'));
        database.relations(database.tables('Salas').cols("PK"), database.tables('Programaciones').cols('Sala'));
        database.relations(database.tables('STPS Agentes capacitador').cols("PK"), database.tables('Empresas').cols('STPS Agente capacitador'));
        database.relations(database.tables('STPS Áreas ocupación').cols("PK"), database.tables('STPS Ocupaciones').cols('Área'));
        database.relations(database.tables('STPS Áreas temáticas').cols("PK"), database.tables('Cursos').cols('STPS Área temática'));
        database.relations(database.tables('STPS Objetivos').cols("PK"), database.tables('Cursos').cols('STPS Objetivo'));
        database.relations(database.tables('Temas').cols("PK"), database.tables('Modulos').cols('Tema'));
        database.relations(database.tables('Modulos').cols("PK"), database.tables('Programaciones').cols('Modulo'));
        database.relations(database.tables('Tipos empresa').cols("PK"), database.tables('Empresas').cols('Tipo'));

        database.relations(database.tables("KPI's").cols("PK"), database.tables("KPI's 2014").cols('KPI'));
        database.relations(database.tables('Empresas').cols("PK"), database.tables("KPI's 2014").cols('Alumno -Lugar -Empresa'));
        database.relations(database.tables('Direcciones').cols("PK"), database.tables("KPI's 2014").cols('Alumno -Dirección'));
        database.relations(database.tables('Colaborador tipos').cols("PK"), database.tables("KPI's 2014").cols('Alumno -Tipo colaborador'));

        database.relations(database.tables("KPI's").cols("PK"), database.tables("KPI's 2015").cols('KPI'));
        database.relations(database.tables('Empresas').cols("PK"), database.tables("KPI's 2015").cols('Alumno -Lugar -Empresa'));
        database.relations(database.tables('Direcciones').cols("PK"), database.tables("KPI's 2015").cols('Alumno -Dirección'));
        database.relations(database.tables('Colaborador tipos').cols("PK"), database.tables("KPI's 2015").cols('Alumno -Tipo colaborador'));

        database.relations(database.tables("KPI's").cols("PK"), database.tables("KPI's capacitaciones").cols('KPI'));
        database.relations(database.tables('Capacitaciones').cols("PK"), database.tables("KPI's capacitaciones").cols('Capacitación'));
        database.relations(database.tables('Direcciones').cols("PK"), database.tables("KPI's capacitaciones").cols('Alumno -Dirección'));


        var sesionpk = database.tables("Sesiones").pk;
        var colaboradorespk = database.tables("Colaboradores").pk;
        for (var table_i = 0, tables = database.tables(), table, col; table_i < tables.length; table_i++) {
            table = tables[table_i];
            if (table.title[0] === "Sesiones") {
                database.relations(database.tables('Colaboradores').pk, database.tables('Sesiones').cols('Colaborador'));
            } else {
                col = table.cols().find(function (col) { return col.title === "Sesión insertado" || col.title === "Sesión"; });
                if (col) { database.relations(sesionpk, col); }
                col = table.cols().find(function (col) { return col.title === "Sesión actualizado"; });
                if (col) { database.relations(sesionpk, col); }
                col = table.cols().find(function (col) { return col.title === "Insertado por"; });
                if (col) { database.relations(colaboradorespk, col); }
                col = table.cols().find(function (col) { return col.title === "Actualizado por"; });
                if (col) { database.relations(colaboradorespk, col); }
            }
        }


        database.sesion = database.tables('Sesiones').rows(database.tables('Sesión').rows()[0][0]);
        database.colaborador = database.sesion.cell("Colaborador").val();
        database.tables("Problema comentarios").cols("Colaborador").default = database.colaborador;
        database.tables("Problema suscricpciones").cols("Colaborador").default = database.colaborador;
        database.tables("Problema tiempos").cols("Colaborador").default = database.colaborador;

        //database.cuenta = database.tables('Cuentas').rows(database.sesion.rows('Colaborador >Cuentas|Colaborador')[0]);
        //var sessionempresas = database.cuenta.rows('Permisos|Cuenta >Empresa');
        var menu = $('#menu');
        var tabledisplay = $('#tabledisplay').addClass("ui-widget-content");
        tabledisplay.prop("title", "Inicio");
        var table = ITable({
            title: ["Tabla", "Tabla"],
            insert: true, update: true, delete: true,
            cols: [{
                title: "Tabla", parent: database.tables(), onChange: function (table) {
                    if (table.isVal()) {
                        table.val().rows().formsear(function () { }, tabledisplay, "table");
                    } else { tabledisplay.empty(); }
                }
            }]
        }).rows("NEW").cell("Tabla");
        menu.append(table.row.ashtml("vertical", true));
        //database.sesion.cell('Colaborador').val().form();

        database.form(database.sesion, $('#sesion'));
        $('#singout').on('click', $.comex.singout);
    });
} catch (e) { alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(e.message)); }
